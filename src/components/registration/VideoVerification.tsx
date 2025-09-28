// import { useState, useRef, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Camera,
//   RotateCcw,
//   CheckCircle,
//   XCircle,
//   Video,
//   Loader2,
//   AlertTriangle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// interface VideoVerificationProps {
//   firstName: string;
//   lastName: string;
//   onVerificationComplete: (verification: {
//     videoBlob: Blob | null;
//     isVerified: boolean;
//     verificationStatus: "pending" | "approved" | "rejected";
//     verificationMessage?: string;
//   }) => void;
// }

// type RecordingState =
//   | "idle"
//   | "requesting-permission"
//   | "ready"
//   | "recording"
//   | "recorded"
//   | "processing"
//   | "verified";

// /** Prefer Safari-friendly types first, then WebM. Also log support for easier debugging. */
// const getSupportedMimeType = (): string => {
//   const possibleTypes = [
//     // Safari / iOS first
//     "video/mp4;codecs=avc1,mp4a.40.2",
//     "video/mp4;codecs=h264,aac",
//     "video/mp4;codecs=avc1",
//     "video/mp4",
//     // WebM fallbacks
//     "video/webm;codecs=vp9,opus",
//     "video/webm;codecs=vp8,opus",
//     "video/webm;codecs=vp9",
//     "video/webm;codecs=vp8",
//     "video/webm",
//   ];

//   // Log support table (if MediaRecorder exists)
//   possibleTypes.forEach((type) => {
//     const supported =
//       typeof MediaRecorder !== "undefined" &&
//       MediaRecorder.isTypeSupported(type);
//     // eslint-disable-next-line no-console
//     console.log(`[MediaRecorder] ${type}: ${supported}`);
//   });

//   const supportedType =
//     possibleTypes.find(
//       (type) =>
//         typeof MediaRecorder !== "undefined" &&
//         MediaRecorder.isTypeSupported(type)
//     ) || "video/webm";

//   // eslint-disable-next-line no-console
//   console.log("[MediaRecorder] Selected MIME type:", supportedType);
//   return supportedType;
// };

// export function VideoVerification({
//   firstName,
//   lastName,
//   onVerificationComplete,
// }: VideoVerificationProps) {
//   const [recordingState, setRecordingState] = useState<RecordingState>("idle");
//   const [stream, setStream] = useState<MediaStream | null>(null);

//   const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
//   const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

//   const [countdown, setCountdown] = useState(0);
//   const [verificationStatus, setVerificationStatus] = useState<
//     "pending" | "approved" | "rejected"
//   >("pending");
//   const [verificationMessage, setVerificationMessage] = useState<string>("");
//   const [recordingProgress, setRecordingProgress] = useState(0);
//   const [error, setError] = useState<string>("");

//   const videoRef = useRef<HTMLVideoElement>(null); // live preview
//   const recordedVideoRef = useRef<HTMLVideoElement>(null); // playback
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);
//   const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   const requiredText = `من ${firstName} ${lastName} هستم و می‌خواهم eSIM داریا سل بخرم`;

//   // Mock verification function (replace with real API when ready)
//   const mockVerifyVideo = async (): Promise<{
//     approved: boolean;
//     message: string;
//   }> => {
//     await new Promise((r) => setTimeout(r, 3000));
//     const approved = Math.random() > 0.2;
//     return approved
//       ? {
//           approved: true,
//           message: "ویدیو شما با موفقیت تأیید شد. هویت شما احراز گردید.",
//         }
//       : {
//           approved: false,
//           message:
//             "متأسفانه نتوانستیم ویدیو شما را تأیید کنیم. لطفاً دوباره تلاش کنید و اطمینان حاصل کنید که متن را به درستی بیان می‌کنید.",
//         };
//   };

//   // Cleanup
//   const cleanup = useCallback(() => {
//     if (stream) {
//       stream.getTracks().forEach((t) => t.stop());
//     }
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
//       mediaRecorderRef.current.stop();
//     }
//     if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
//     if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
//     if (recordedUrl) URL.revokeObjectURL(recordedUrl);
//   }, [stream, recordedUrl]);

//   const requestCameraPermission = async () => {
//     setRecordingState("requesting-permission");
//     setError("");

//     try {
//       if (!navigator.mediaDevices?.getUserMedia) {
//         throw new Error("MediaDevices API is not available in this browser.");
//       }

//       // More conservative constraints for compatibility
//       const constraints: MediaStreamConstraints = {
//         video: {
//           width: { ideal: 640, max: 1280 },
//           height: { ideal: 480, max: 720 },
//           frameRate: { ideal: 15, max: 30 },
//           facingMode: "user",
//         },
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//         },
//       };

//       // eslint-disable-next-line no-console
//       console.log("[getUserMedia] constraints:", constraints);

//       const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
//       setStream(mediaStream);

//       // Log track settings for debugging
//       const vTrack = mediaStream.getVideoTracks()[0];
//       if (vTrack) {
//         // eslint-disable-next-line no-console
//         console.log("[VideoTrack] settings:", vTrack.getSettings());
//         // eslint-disable-next-line no-console
//         console.log("[VideoTrack] constraints:", vTrack.getConstraints());
//       }

//       // Attach to preview immediately (in case it's already mounted)
//       if (videoRef.current) {
//         const el = videoRef.current;
//         el.srcObject = mediaStream;
//         el.muted = true;
//         el.playsInline = true;
//         el.autoplay = true;

//         await new Promise<void>((resolve) => {
//           const onLoadedMetadata = () => {
//             el.play().catch((e) =>
//               console.warn("Preview autoplay blocked:", e)
//             );
//             resolve();
//           };
//           const onError = () => resolve();
//           el.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
//           el.addEventListener("error", onError, { once: true });
//           setTimeout(() => {
//             el.removeEventListener("loadedmetadata", onLoadedMetadata);
//             el.removeEventListener("error", onError);
//             resolve();
//           }, 5000);
//         });
//       }

//       setRecordingState("ready");
//       toast.success("دوربین آماده است");
      
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       console.error("Camera access error:", err);

//       let errorMessage = "دسترسی به دوربین رد شد.";
//       let retryVideoOnly = false;

//       if (err?.name === "NotAllowedError") {
//         errorMessage = "دسترسی به دوربین رد شد. لطفاً دسترسی را مجاز کنید.";
//         if (location.protocol !== "https:" && location.hostname !== "localhost") {
//           errorMessage += " توجه: برای عملکرد صحیح در سرور، HTTPS مورد نیاز است.";
//         }
//       } else if (err?.name === "NotFoundError") {
//         errorMessage = "دوربین پیدا نشد. لطفاً دوربین را وصل کنید.";
//       } else if (err?.name === "NotSupportedError") {
//         errorMessage = "مرورگر شما از این قابلیت پشتیبانی نمی‌کند.";
//       } else if (
//         err?.name === "OverconstrainedError" ||
//         (err?.message || "").includes("audio")
//       ) {
//         errorMessage =
//           "مشکل در میکروفون/تنظیمات. تلاش با ویدیو بدون صدا...";
//         retryVideoOnly = true;
//       }

//       if (retryVideoOnly) {
//         try {
//           const fallback = await navigator.mediaDevices.getUserMedia({
//             video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
//           });
//           setStream(fallback);
//           if (videoRef.current) {
//             videoRef.current.srcObject = fallback;
//             videoRef.current.muted = true;
//             videoRef.current.playsInline = true;
//             videoRef.current.autoplay = true;
//             videoRef.current.play().catch(() => {});
//           }
//           setRecordingState("ready");
//           toast.success("دوربین آماده است (بدون صدا)");
//           return;
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         } catch (e) {
//           errorMessage = "دسترسی به دوربین ناموفق بود.";
//         }
//       }

//       setError(errorMessage);
//       toast.error(errorMessage);
//       setRecordingState("idle");
//     }
//   };

//   const startRecording = () => {
//     if (!stream || stream.getVideoTracks().length === 0) {
//       toast.error("دوربین آماده نیست");
//       return;
//     }
//     if (typeof MediaRecorder === "undefined") {
//       toast.error("مرورگر شما از ضبط ویدیو پشتیبانی نمی‌کند.");
//       return;
//     }

//     // Reset state & ensure live tracks are enabled
//     chunksRef.current = [];
//     setRecordingProgress(0);
//     setRecordedBlob(null);
//     setRecordedUrl((prev) => {
//       if (prev) URL.revokeObjectURL(prev);
//       return null;
//     });
//     stream.getTracks().forEach((t) => (t.enabled = true));

//     try {
//       const mimeType = getSupportedMimeType();
//       const options: MediaRecorderOptions = {
//         mimeType,
//         videoBitsPerSecond: 1_000_000,
//         audioBitsPerSecond: 64_000,
//       };

//       let mr: MediaRecorder;
//       try {
//         mr = new MediaRecorder(stream, options);
//       } catch {
//         mr = new MediaRecorder(stream);
//       }
//       mediaRecorderRef.current = mr;

//       mr.ondataavailable = (e) => {
//         if (e.data?.size > 0) chunksRef.current.push(e.data);
//       };

//       mr.onerror = (e) => {
//         console.error("MediaRecorder error:", e);
//         toast.error("خطا در ضبط ویدیو");
//         setRecordingState("ready");
//       };

//       mr.onstop = () => {
//         const containerType = (mimeType || "video/webm").split(";")[0];
//         if (!chunksRef.current.length) {
//           toast.error("خطا در ضبط ویدیو. لطفاً دوباره تلاش کنید.");
//           setRecordingState("ready");
//           return;
//         }

//         const blob = new Blob(chunksRef.current, { type: containerType });
//         if (blob.size === 0) {
//           toast.error("فایل ویدیو خالی است.");
//           setRecordingState("ready");
//           return;
//         }

//         // Stop showing live movement
//         stream.getTracks().forEach((t) => (t.enabled = false));
//         if (videoRef.current) {
//           try {
//             videoRef.current.pause();
//           } catch {
//             /* noop */
//           }
//         }

//         setRecordedBlob(blob);
//         setRecordingState("recorded");
//         mediaRecorderRef.current = null;
//       };

//       // 3-second countdown
//       let count = 3;
//       setCountdown(count);
//       const cd = setInterval(() => {
//         count -= 1;
//         setCountdown(count);

//         if (count === 0) {
//           clearInterval(cd);
//           setRecordingState("recording");

//           mr.start(1000); // gather chunks every second

//           // progress 5s → 100%
//           let progress = 0;
//           progressIntervalRef.current = setInterval(() => {
//             progress += 20;
//             setRecordingProgress(Math.min(100, progress));
//           }, 1000);

//           // auto-stop after 5 seconds
//           recordingTimeoutRef.current = setTimeout(() => {
//             if (mr.state === "recording") {
//               try {
//                 mr.requestData();
//               } catch {
//                 /* noop */
//               }
//               mr.stop();
//             }
//             if (progressIntervalRef.current) {
//               clearInterval(progressIntervalRef.current);
//             }
//           }, 5000);
//         }
//       }, 1000);
//     } catch (err) {
//       console.error("Error starting recording:", err);
//       toast.error("خطا در شروع ضبط ویدیو");
//       setRecordingState("ready");
//     }
//   };

//   const retryRecording = () => {
//     // Prepare for another take
//     setRecordedBlob(null);
//     setRecordedUrl((prev) => {
//       if (prev) URL.revokeObjectURL(prev);
//       return null;
//     });
//     setVerificationStatus("pending");
//     setVerificationMessage("");
//     setRecordingProgress(0);
//     setError("");

//     // Re-enable tracks for the next preview/recording
//     if (stream) stream.getTracks().forEach((t) => (t.enabled = true));

//     if (recordedVideoRef.current) {
//       recordedVideoRef.current.pause();
//       recordedVideoRef.current.removeAttribute("src");
//       recordedVideoRef.current.load();
//     }
//     setRecordingState("ready");
//   };

//   const submitVideo = async () => {
//     if (!recordedBlob) return;
//     setRecordingState("processing");
//     try {
//       const result = await mockVerifyVideo();
//       setVerificationStatus(result.approved ? "approved" : "rejected");
//       setVerificationMessage(result.message);
//       setRecordingState("verified");

//       onVerificationComplete({
//         videoBlob: recordedBlob,
//         isVerified: result.approved,
//         verificationStatus: result.approved ? "approved" : "rejected",
//         verificationMessage: result.message,
//       });

//       if (result.approved) toast.success("تأیید هویت با موفقیت انجام شد!");
//       else toast.error("تأیید هویت ناموفق بود. لطفاً دوباره تلاش کنید.");
//     } catch (e) {
//       console.error("Verification failed:", e);
//       toast.error("خطا در تأیید هویت. لطفاً دوباره تلاش کنید.");
//       setRecordingState("recorded");
//     }
//   };

//   /** Keep preview attached after remounts (fix for black frame with AnimatePresence) */
//   useEffect(() => {
//     if (!videoRef.current || !stream) return;
//     const el = videoRef.current;
//     el.srcObject = stream;
//     el.muted = true;
//     el.playsInline = true;
//     el.autoplay = true;
//     el.play().catch(() => {});
//   }, [stream, recordingState]);

//   /** Build a fresh object URL when we have a new blob */
//   useEffect(() => {
//     if (!recordedBlob) return;
//     const url = URL.createObjectURL(recordedBlob);
//     setRecordedUrl((prev) => {
//       if (prev) URL.revokeObjectURL(prev);
//       return url;
//     });
//   }, [recordedBlob]);

//   /** Ensure recorded video loads and (muted) auto-plays when ready */
//   useEffect(() => {
//     if (!recordedUrl || !recordedVideoRef.current) return;
//     const el = recordedVideoRef.current;
//     el.muted = true; // needed for autoplay on mobile
//     el.autoplay = true;
//     el.playsInline = true;
//     el.load(); // ensure the new src is parsed
//     const tryPlay = () => el.play().catch((e) => console.warn("Autoplay blocked:", e));
//     if (el.readyState >= 2) tryPlay();
//     else {
//       const onCanPlay = () => {
//         el.removeEventListener("canplay", onCanPlay);
//         tryPlay();
//       };
//       el.addEventListener("canplay", onCanPlay);
//       return () => el.removeEventListener("canplay", onCanPlay);
//     }
//   }, [recordedUrl]);

//   // Cleanup on unmount
//   useEffect(() => cleanup, [cleanup]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="w-full h-full"
//     >
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-4 lg:p-6 xl:p-8 h-full flex flex-col">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-4 lg:mb-6">
//           <div className="p-2 lg:p-3 bg-blue-500 rounded-lg">
//             <Video className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//           </div>
//           <div>
//             <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
//               تأیید هویت ویدیویی
//             </h3>
//             <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">
//               برای تأیید هویت، ویدیو 5 ثانیه‌ای از خود ضبط کنید
//             </p>
//           </div>
//         </div>

//         {/* ✅ Instructions (restored) */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 border border-blue-200 dark:border-blue-600 flex-shrink-0">
//           <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3">
//             راهنمای ضبط ویدیو
//           </h4>
//           <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300">
//             <div className="flex items-start gap-2">
//               <span className="text-blue-500 font-bold">۱.</span>
//               <span>ویدیو به مدت 5 ثانیه ضبط خواهد شد</span>
//             </div>
//             <div className="flex items-start gap-2">
//               <span className="text-blue-500 font-bold">۲.</span>
//               <span>در مقابل دوربین قرار گیرید و روشن صحبت کنید</span>
//             </div>
//             <div className="flex items-start gap-2">
//               <span className="text-blue-500 font-bold">۳.</span>
//               <span>متن زیر را با صدای بلند و واضح بخوانید:</span>
//             </div>
//           </div>
//           <div className="bg-blue-50 dark:bg-blue-900/30 p-2 lg:p-3 rounded-lg mt-2 lg:mt-3">
//             <p className="text-center font-medium text-blue-900 dark:text-blue-100 text-sm lg:text-base">
//               "{requiredText}"
//             </p>
//           </div>
//         </div>

//         {/* HTTPS Warning */}
//         {location.protocol !== "https:" && location.hostname !== "localhost" && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 lg:mb-6">
//             <div className="flex items-start gap-2 text-yellow-700">
//               <AlertTriangle className="w-5 h-5 mt-0.5" />
//               <div>
//                 <p className="font-medium mb-1">هشدار HTTPS</p>
//                 <p className="text-sm">
//                   برای عملکرد صحیح دوربین در سرور، باید از HTTPS استفاده کنید. getUserMedia تنها در
//                   محیط‌های امن (HTTPS یا localhost) کار می‌کند.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 lg:mb-6">
//             <div className="flex items-center gap-2 text-red-700">
//               <AlertTriangle className="w-5 h-5" />
//               <span className="font-medium">{error}</span>
//             </div>
//           </div>
//         )}

//         {/* Debug Panel (dev only) */}
//         {process.env.NODE_ENV === "development" && stream && (
//           <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-4 text-xs">
//             <details className="cursor-pointer">
//               <summary className="font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 اطلاعات فنی (Debug)
//               </summary>
//               <div className="space-y-1 text-gray-600 dark:text-gray-400">
//                 <div>Protocol: {location.protocol}</div>
//                 <div>Hostname: {location.hostname}</div>
//                 <div>User Agent: {navigator.userAgent.slice(0, 60)}...</div>
//                 <div>Video Tracks: {stream.getVideoTracks().length}</div>
//                 <div>Audio Tracks: {stream.getAudioTracks().length}</div>
//                 {stream.getVideoTracks()[0] && (
//                   <div>
//                     Video Settings:{" "}
//                     {JSON.stringify(stream.getVideoTracks()[0].getSettings())}
//                   </div>
//                 )}
//               </div>
//             </details>
//           </div>
//         )}

//         {/* Video Recording Interface */}
//         <div className="relative flex-1 min-h-0">
//           <AnimatePresence mode="wait">
//             {recordingState === "idle" && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center py-4 lg:py-6 h-full flex flex-col justify-center"
//               >
//                 <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
//                   <Camera className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-3 lg:mb-4" />
//                   <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                     آماده ضبط ویدیو
//                   </h4>
//                   <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-4 lg:mb-6">
//                     برای شروع تأیید هویت، دسترسی به دوربین را مجاز کنید
//                   </p>
//                   <Button
//                     onClick={requestCameraPermission}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 lg:px-8 lg:py-3 text-base lg:text-lg mx-auto"
//                   >
//                     <Camera className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
//                     شروع تأیید هویت
//                   </Button>
//                 </div>
//               </motion.div>
//             )}

//             {recordingState === "requesting-permission" && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center py-4 lg:py-6 h-full flex flex-col justify-center"
//               >
//                 <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
//                   <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-500 mx-auto mb-3 lg:mb-4 animate-spin" />
//                   <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                     درخواست دسترسی به دوربین
//                   </h4>
//                   <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
//                     لطفاً دسترسی به دوربین و میکروفون را مجاز کنید
//                   </p>
//                 </div>
//               </motion.div>
//             )}

//             {(recordingState === "ready" || countdown > 0) && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="space-y-3 lg:space-y-4 h-full flex flex-col"
//               >
//                 <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex-1 min-h-0">
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     className="w-full h-full object-cover"
//                   />
//                   {countdown > 0 && (
//                     <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
//                       <div className="text-center">
//                         <div className="text-4xl lg:text-6xl font-bold text-white mb-2 lg:mb-4">
//                           {countdown}
//                         </div>
//                         <p className="text-white text-base lg:text-lg">
//                           آماده شوید...
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {recordingState === "ready" && (
//                   <div className="text-center flex-shrink-0">
//                     <Button
//                       onClick={startRecording}
//                       className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 lg:px-8 lg:py-3 text-base lg:text-lg"
//                     >
//                       <Camera className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
//                       شروع ضبط
//                     </Button>
//                   </div>
//                 )}
//               </motion.div>
//             )}

//             {recordingState === "recording" && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="space-y-3 lg:space-y-4 h-full flex flex-col"
//               >
//                 <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex-1 min-h-0">
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     className="w-full h-full object-cover"
//                   />

//                   {/* REC badge */}
//                   <div className="absolute top-2 lg:top-4 left-2 lg:left-4 bg-red-500 text-white px-2 lg:px-3 py-1 lg:py-2 rounded-full flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
//                     <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full animate-pulse" />
//                     در حال ضبط
//                   </div>

//                   {/* Progress bar */}
//                   <div className="absolute bottom-2 lg:bottom-4 left-2 lg:left-4 right-2 lg:right-4">
//                     <div className="bg-black/50 rounded-full p-1">
//                       <div
//                         className="bg-red-500 h-1.5 lg:h-2 rounded-full transition-all duration-1000"
//                         style={{ width: `${recordingProgress}%` }}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-center flex-shrink-0">
//                   <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
//                     در حال ضبط... لطفاً متن را با صدای بلند بخوانید
//                   </p>
//                 </div>
//               </motion.div>
//             )}

//             {recordingState === "recorded" && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="space-y-3 lg:space-y-4 h-full flex flex-col"
//               >
//                 <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex-1 min-h-0">
//                   <video
//                     key={recordedUrl ?? "no-clip"} // force fresh mount per clip
//                     ref={recordedVideoRef}
//                     src={recordedUrl ?? undefined}
//                     controls
//                     autoPlay
//                     muted
//                     playsInline
//                     preload="metadata"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="flex gap-2 lg:gap-3 justify-center flex-wrap flex-shrink-0">
//                   <Button
//                     onClick={retryRecording}
//                     variant="outline"
//                     className="px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base"
//                   >
//                     <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
//                     ضبط مجدد
//                   </Button>
//                   <Button
//                     onClick={submitVideo}
//                     className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base"
//                   >
//                     <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
//                     تأیید و ارسال
//                   </Button>
//                 </div>
//               </motion.div>
//             )}

//             {recordingState === "processing" && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center py-4 lg:py-6 h-full flex flex-col justify-center"
//               >
//                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
//                   <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 text-blue-500 mx-auto mb-3 lg:mb-4 animate-spin" />
//                   <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                     در حال بررسی ویدیو
//                   </h4>
//                   <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
//                     لطفاً صبر کنید، ویدیو شما در حال تأیید است...
//                   </p>
//                 </div>
//               </motion.div>
//             )}

//             {recordingState === "verified" && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center py-4 lg:py-6 h-full flex flex-col justify-center"
//               >
//                 {verificationStatus === "approved" ? (
//                   <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
//                     <CheckCircle className="w-12 h-12 lg:w-16 lg:h-16 text-green-500 mx-auto mb-3 lg:mb-4" />
//                     <h4 className="text-base lg:text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
//                       تأیید موفق
//                     </h4>
//                     <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
//                       {verificationMessage}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
//                     <XCircle className="w-12 h-12 lg:w-16 lg:h-16 text-red-500 mx-auto mb-3 lg:mb-4" />
//                     <h4 className="text-base lg:text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
//                       تأیید ناموفق
//                     </h4>
//                     <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-4">
//                       {verificationMessage}
//                     </p>
//                     <Button
//                       onClick={() => setRecordingState("idle")}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base mx-auto"
//                     >
//                       تلاش مجدد
//                     </Button>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  RotateCcw,
  CheckCircle,
  XCircle,
  Video,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface VideoVerificationProps {
  firstName: string;
  lastName: string;
  onVerificationComplete: (verification: {
    videoBlob: Blob | null;
    isVerified: boolean;
    verificationStatus: "pending" | "approved" | "rejected";
    verificationMessage?: string;
  }) => void;
}

type RecordingState =
  | "idle"
  | "requesting-permission"
  | "ready"
  | "recording"
  | "recorded"
  | "processing"
  | "verified";

/** Prefer Safari-friendly types first, then WebM. Also log support for easier debugging. */
const getSupportedMimeType = (): string => {
  const possibleTypes = [
    // Safari / iOS first
    "video/mp4;codecs=avc1,mp4a.40.2",
    "video/mp4;codecs=h264,aac",
    "video/mp4;codecs=avc1",
    "video/mp4",
    // WebM fallbacks
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  possibleTypes.forEach((type) => {
    const supported =
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(type);
    // eslint-disable-next-line no-console
    console.log(`[MediaRecorder] ${type}: ${supported}`);
  });

  const supportedType =
    possibleTypes.find(
      (type) =>
        typeof MediaRecorder !== "undefined" &&
        MediaRecorder.isTypeSupported(type)
    ) || "video/webm";

  // eslint-disable-next-line no-console
  console.log("[MediaRecorder] Selected MIME type:", supportedType);
  return supportedType;
};

export function VideoVerification({
  firstName,
  lastName,
  onVerificationComplete,
}: VideoVerificationProps) {
  const { t } = useTranslation();
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const [countdown, setCountdown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [error, setError] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null); // live preview
  const recordedVideoRef = useRef<HTMLVideoElement>(null); // playback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const requiredText = t("video.instructions.requiredText", {
    firstName,
    lastName,
  });

  // Mock verification function (replace with real API when ready)
  const mockVerifyVideo = async (): Promise<{
    approved: boolean;
    message: string;
  }> => {
    await new Promise((r) => setTimeout(r, 3000));
    const approved = Math.random() > 0.2;
    return approved
      ? {
          approved: true,
          message: t("video.toasts.verifySuccess"),
        }
      : {
          approved: false,
          message: t("video.toasts.verifyFail"),
        };
  };

  // Cleanup
  const cleanup = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
  }, [stream, recordedUrl]);

  const requestCameraPermission = async () => {
    setRecordingState("requesting-permission");
    setError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("MediaDevices API is not available in this browser.");
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 15, max: 30 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };

      // eslint-disable-next-line no-console
      console.log("[getUserMedia] constraints:", constraints);

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      const vTrack = mediaStream.getVideoTracks()[0];
      if (vTrack) {
        // eslint-disable-next-line no-console
        console.log("[VideoTrack] settings:", vTrack.getSettings());
        // eslint-disable-next-line no-console
        console.log("[VideoTrack] constraints:", vTrack.getConstraints());
      }

      if (videoRef.current) {
        const el = videoRef.current;
        el.srcObject = mediaStream;
        el.muted = true;
        el.playsInline = true;
        el.autoplay = true;

        await new Promise<void>((resolve) => {
          const onLoadedMetadata = () => {
            el.play().catch((e) => console.warn("Preview autoplay blocked:", e));
            resolve();
          };
          const onError = () => resolve();
          el.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
          el.addEventListener("error", onError, { once: true });
          setTimeout(() => {
            el.removeEventListener("loadedmetadata", onLoadedMetadata);
            el.removeEventListener("error", onError);
            resolve();
          }, 5000);
        });
      }

      setRecordingState("ready");
      toast.success(t("video.toasts.cameraReady"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Camera access error:", err);

      let errorMessage = t("video.errors.cameraDenied");
      let retryVideoOnly = false;

      if (err?.name === "NotAllowedError") {
        errorMessage = t("video.errors.cameraDenied") +
          (location.protocol !== "https:" && location.hostname !== "localhost"
            ? t("video.errors.httpsRequired")
            : "");
      } else if (err?.name === "NotFoundError") {
        errorMessage = t("video.errors.cameraNotFound");
      } else if (err?.name === "NotSupportedError") {
        errorMessage = t("video.errors.notSupported");
      } else if (
        err?.name === "OverconstrainedError" ||
        (err?.message || "").includes("audio")
      ) {
        errorMessage = t("video.errors.micIssueRetryVideoOnly");
        retryVideoOnly = true;
      }

      if (retryVideoOnly) {
        try {
          const fallback = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          });
          setStream(fallback);
          if (videoRef.current) {
            videoRef.current.srcObject = fallback;
            videoRef.current.muted = true;
            videoRef.current.playsInline = true;
            videoRef.current.autoplay = true;
            videoRef.current.play().catch(() => {});
          }
          setRecordingState("ready");
          toast.success(t("video.toasts.cameraReadyNoAudio"));
          return;
        } catch {
          errorMessage = t("video.errors.cameraAccessFailed");
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
      setRecordingState("idle");
    }
  };

  const startRecording = () => {
    if (!stream || stream.getVideoTracks().length === 0) {
      toast.error(t("video.errors.cameraNotReady"));
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      toast.error(t("video.toasts.notSupported"));
      return;
    }

    chunksRef.current = [];
    setRecordingProgress(0);
    setRecordedBlob(null);
    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    stream.getTracks().forEach((t) => (t.enabled = true));

    try {
      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = {
        mimeType,
        videoBitsPerSecond: 1_000_000,
        audioBitsPerSecond: 64_000,
      };

      let mr: MediaRecorder;
      try {
        mr = new MediaRecorder(stream, options);
      } catch {
        mr = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data?.size > 0) chunksRef.current.push(e.data);
      };

      mr.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        toast.error(t("video.toasts.recError"));
        setRecordingState("ready");
      };

      mr.onstop = () => {
        const containerType = (mimeType || "video/webm").split(";")[0];
        if (!chunksRef.current.length) {
          toast.error(t("video.toasts.recError"));
          setRecordingState("ready");
          return;
        }

        const blob = new Blob(chunksRef.current, { type: containerType });
        if (blob.size === 0) {
          toast.error(t("video.toasts.fileEmpty"));
          setRecordingState("ready");
          return;
        }

        stream.getTracks().forEach((t) => (t.enabled = false));
        if (videoRef.current) {
          try {
            videoRef.current.pause();
          } catch {
            /* noop */
          }
        }

        setRecordedBlob(blob);
        setRecordingState("recorded");
        mediaRecorderRef.current = null;
      };

      // 3-second countdown
      let count = 3;
      setCountdown(count);
      const cd = setInterval(() => {
        count -= 1;
        setCountdown(count);

        if (count === 0) {
          clearInterval(cd);
          setRecordingState("recording");

          mr.start(1000); // gather chunks every second

          let progress = 0;
          progressIntervalRef.current = setInterval(() => {
            progress += 20;
            setRecordingProgress(Math.min(100, progress));
          }, 1000);

          // auto-stop after 5 seconds
          recordingTimeoutRef.current = setTimeout(() => {
            if (mr.state === "recording") {
              try {
                mr.requestData();
              } catch {
                /* noop */
              }
              mr.stop();
            }
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
          }, 5000);
        }
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      toast.error(t("video.toasts.startRecError"));
      setRecordingState("ready");
    }
  };

  const retryRecording = () => {
    setRecordedBlob(null);
    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setVerificationStatus("pending");
    setVerificationMessage("");
    setRecordingProgress(0);
    setError("");

    if (stream) stream.getTracks().forEach((t) => (t.enabled = true));

    if (recordedVideoRef.current) {
      recordedVideoRef.current.pause();
      recordedVideoRef.current.removeAttribute("src");
      recordedVideoRef.current.load();
    }
    setRecordingState("ready");
  };

  const submitVideo = async () => {
    if (!recordedBlob) return;
    setRecordingState("processing");
    try {
      const result = await mockVerifyVideo();
      setVerificationStatus(result.approved ? "approved" : "rejected");
      setVerificationMessage(result.message);
      setRecordingState("verified");

      onVerificationComplete({
        videoBlob: recordedBlob,
        isVerified: result.approved,
        verificationStatus: result.approved ? "approved" : "rejected",
        verificationMessage: result.message,
      });

      if (result.approved) toast.success(t("video.toasts.verifySuccess"));
      else toast.error(t("video.toasts.verifyFail"));
    } catch (e) {
      console.error("Verification failed:", e);
      toast.error(t("video.toasts.verifyError"));
      setRecordingState("recorded");
    }
  };

  /** Keep preview attached after remounts (fix for black frame with AnimatePresence) */
  useEffect(() => {
    if (!videoRef.current || !stream) return;
    const el = videoRef.current;
    el.srcObject = stream;
    el.muted = true;
    el.playsInline = true;
    el.autoplay = true;
    el.play().catch(() => {});
  }, [stream, recordingState]);

  /** Build a fresh object URL when we have a new blob */
  useEffect(() => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    setRecordedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }, [recordedBlob]);

  /** Ensure recorded video loads and (muted) auto-plays when ready */
  useEffect(() => {
    if (!recordedUrl || !recordedVideoRef.current) return;
    const el = recordedVideoRef.current;
    el.muted = true; // needed for autoplay on mobile
    el.autoplay = true;
    el.playsInline = true;
    el.load();
    const tryPlay = () => el.play().catch((e) => console.warn("Autoplay blocked:", e));
    if (el.readyState >= 2) tryPlay();
    else {
      const onCanPlay = () => {
        el.removeEventListener("canplay", onCanPlay);
        tryPlay();
      };
      el.addEventListener("canplay", onCanPlay);
      return () => el.removeEventListener("canplay", onCanPlay);
    }
  }, [recordedUrl]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full"
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-4 lg:p-6 xl:p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 lg:mb-6">
          <div className="p-2 lg:p-3 bg-blue-500 rounded-lg">
            <Video className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
              {t("video.header.title")}
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">
              {t("video.header.subtitle")}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 border border-blue-200 dark:border-blue-600 flex-shrink-0">
          <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3">
            {t("video.instructions.title")}
          </h4>
          <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">۱.</span>
              <span>{t("video.instructions.bullets.one")}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">۲.</span>
              <span>{t("video.instructions.bullets.two")}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">۳.</span>
              <span>{t("video.instructions.bullets.three")}</span>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-2 lg:p-3 rounded-lg mt-2 lg:mt-3">
            <p className="text-center font-medium text-blue-900 dark:text-blue-100 text-sm lg:text-base">
              "{requiredText}"
            </p>
          </div>
        </div>

        {/* HTTPS Warning */}
        {location.protocol !== "https:" && location.hostname !== "localhost" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 lg:mb-6">
            <div className="flex items-start gap-2 text-yellow-700">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium mb-1">{t("video.httpsWarning.title")}</p>
                <p className="text-sm">{t("video.httpsWarning.body")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 lg:mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Debug Panel (dev only) */}
        {process.env.NODE_ENV === "development" && stream && (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-4 text-xs">
            <details className="cursor-pointer">
              <summary className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("video.debug.title")}
              </summary>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div>{t("video.debug.protocol")}: {location.protocol}</div>
                <div>{t("video.debug.hostname")}: {location.hostname}</div>
                <div>{t("video.debug.userAgent")}: {navigator.userAgent.slice(0, 60)}...</div>
                <div>{t("video.debug.videoTracks")}: {stream.getVideoTracks().length}</div>
                <div>{t("video.debug.audioTracks")}: {stream.getAudioTracks().length}</div>
                {stream.getVideoTracks()[0] && (
                  <div>
                    {t("video.debug.videoSettings")}:{" "}
                    {JSON.stringify(stream.getVideoTracks()[0].getSettings())}
                  </div>
                )}
              </div>
            </details>
          </div>
        )}

        {/* Video Recording Interface */}
        <div className="relative flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {recordingState === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 lg:py-6 h-full flex flex-col justify-center"
              >
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
                  <Camera className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-3 lg:mb-4" />
                  <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("video.idle.title")}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-4 lg:mb-6">
                    {t("video.idle.desc")}
                  </p>
                  <Button
                    onClick={requestCameraPermission}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 lg:px-8 lg:py-3 text-base lg:text-lg mx-auto"
                  >
                    <Camera className="w-4 h-4 lg:w-5 lg:h-5 ltr:mr-2 rtl:ml-2" />
                    {t("video.idle.start")}
                  </Button>
                </div>
              </motion.div>
            )}

            {recordingState === "requesting-permission" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 lg:py-6 h-full flex flex-col justify-center"
              >
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
                  <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-500 mx-auto mb-3 lg:mb-4 animate-spin" />
                  <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("video.permission.title")}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                    {t("video.permission.desc")}
                  </p>
                </div>
              </motion.div>
            )}

            {(recordingState === "ready" || countdown > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 lg:space-y-4 h-full flex flex-col"
              >
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex-1 min-h-0">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {countdown > 0 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl lg:text-6xl font-bold text-white mb-2 lg:mb-4">
                          {countdown}
                        </div>
                        <p className="text-white text-base lg:text-lg">
                          {t("video.countdown.getReady")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {recordingState === "ready" && (
                  <div className="text-center flex-shrink-0">
                    <Button
                      onClick={startRecording}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 lg:px-8 lg:py-3 text-base lg:text-lg"
                    >
                      <Camera className="w-4 h-4 lg:w-5 lg:h-5 ltr:mr-2 rtl:ml-2" />
                      {t("video.ready.start")}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {recordingState === "recording" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 lg:space-y-4 h-full flex flex-col"
              >
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex-1 min-h-0">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* REC badge */}
                  <div className="absolute top-2 lg:top-4 left-2 lg:left-4 bg-red-500 text-white px-2 lg:px-3 py-1 lg:py-2 rounded-full flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full animate-pulse" />
                    {t("video.rec.badge")}
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-2 lg:bottom-4 left-2 lg:left-4 right-2 lg:right-4">
                    <div className="bg-black/50 rounded-full p-1">
                      <div
                        className="bg-red-500 h-1.5 lg:h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${recordingProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center flex-shrink-0">
                  <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                    {t("video.rec.reading")}
                  </p>
                </div>
              </motion.div>
            )}

            {recordingState === "recorded" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 lg:space-y-4 h-full flex flex-col"
              >
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex-1 min-h-0">
                  <video
                    key={recordedUrl ?? "no-clip"}
                    ref={recordedVideoRef}
                    src={recordedUrl ?? undefined}
                    controls
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-2 lg:gap-3 justify-center flex-wrap flex-shrink-0">
                  <Button
                    onClick={retryRecording}
                    variant="outline"
                    className="px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base"
                  >
                    <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 ltr:mr-2 rtl:ml-2" />
                    {t("video.recorded.retry")}
                  </Button>
                  <Button
                    onClick={submitVideo}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base"
                  >
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 ltr:mr-2 rtl:ml-2" />
                    {t("video.recorded.submit")}
                  </Button>
                </div>
              </motion.div>
            )}

            {recordingState === "processing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 lg:py-6 h-full flex flex-col justify-center"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
                  <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 text-blue-500 mx-auto mb-3 lg:mb-4 animate-spin" />
                  <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("video.processing.title")}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                    {t("video.processing.desc")}
                  </p>
                </div>
              </motion.div>
            )}

            {recordingState === "verified" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 lg:py-6 h-full flex flex-col justify-center"
              >
                {verificationStatus === "approved" ? (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
                    <CheckCircle className="w-12 h-12 lg:w-16 lg:h-16 text-green-500 mx-auto mb-3 lg:mb-4" />
                    <h4 className="text-base lg:text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                      {t("video.verified.successTitle")}
                    </h4>
                    <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                      {verificationMessage}
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 lg:p-6 flex-1 flex flex-col justify-center">
                    <XCircle className="w-12 h-12 lg:w-16 lg:h-16 text-red-500 mx-auto mb-3 lg:mb-4" />
                    <h4 className="text-base lg:text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                      {t("video.verified.failTitle")}
                    </h4>
                    <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-4">
                      {verificationMessage}
                    </p>
                    <Button
                      onClick={() => setRecordingState("idle")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base mx-auto"
                    >
                      {t("video.verified.retry")}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
