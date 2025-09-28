// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ArrowLeft, Upload, CheckCircle, Video } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   step2Schema,
//   type Step2FormData,
//   type Step1FormData,
// } from "@/types/registration";
// import { VideoVerification } from "./VideoVerification";

// interface Step2IdCardUploadProps {
//   onSubmit: (data: Step2FormData) => void;
//   onBack: () => void;
//   userInfo: Step1FormData;
// }

// const containerVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6 },
//   },
//   exit: {
//     opacity: 0,
//     y: -20,
//     transition: { duration: 0.3 },
//   },
// };

// export function Step2IdCardUpload({
//   onSubmit,
//   onBack,
//   userInfo,
// }: Step2IdCardUploadProps) {
//   const [dragActive, setDragActive] = useState(false);
//   const [videoVerificationComplete, setVideoVerificationComplete] =
//     useState(false);

//   const form = useForm<Step2FormData>({
//     resolver: zodResolver(step2Schema),
//     defaultValues: {
//       idCardPhoto: undefined,
//       videoVerification: {
//         videoBlob: undefined,
//         isVerified: false,
//         verificationStatus: "pending" as const,
//         verificationMessage: undefined,
//       },
//     },
//   });

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       form.setValue("idCardPhoto", e.dataTransfer.files[0]);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       form.setValue("idCardPhoto", e.target.files[0]);
//     }
//   };

//   const handleVideoVerification = (verification: {
//     videoBlob: Blob | null;
//     isVerified: boolean;
//     verificationStatus: "pending" | "approved" | "rejected";
//     verificationMessage?: string;
//   }) => {
//     form.setValue("videoVerification", verification);
//     setVideoVerificationComplete(verification.isVerified);
//   };

//   return (
//     <motion.div
//       key="step2"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//     >
//       <div className="text-center mb-6 lg:mb-8">
//         <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
//           تأیید هویت
//         </h2>
//         <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//           تصویر کارت ملی خود را آپلود کنید و ویدیو تأیید هویت ضبط کنید
//         </p>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 mb-6 lg:mb-8">
//         {/* ID Card Upload Section */}
//         <div className="order-2 xl:order-1">
//           <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 lg:p-6 xl:p-8 border border-gray-200 dark:border-gray-700 h-full">
//             <div className="mb-6">
//               <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
//                 <Upload className="w-5 h-5 text-red-500" />
//                 آپلود کارت ملی
//               </h3>
//               <p className="text-sm text-gray-600 dark:text-gray-300">
//                 تصویر روی کارت ملی خود را با کیفیت بالا آپلود کنید
//               </p>
//             </div>
//             <Form {...form}>
//               <FormField
//                 control={form.control}
//                 name="idCardPhoto"
//                 render={() => (
//                   <FormItem>
//                     <FormControl>
//                       <div
//                         className={`border-2 border-dashed rounded-xl p-6 lg:p-8 text-center transition-all duration-200 ${
//                           dragActive
//                             ? "border-red-500 bg-red-50 dark:bg-red-900/20 scale-105"
//                             : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                         }`}
//                         onDragEnter={handleDrag}
//                         onDragLeave={handleDrag}
//                         onDragOver={handleDrag}
//                         onDrop={handleDrop}
//                       >
//                         <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
//                         <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">
//                           تصویر کارت ملی خود را بکشید و رها کنید
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
//                           یا روی دکمه زیر کلیک کنید
//                         </p>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleFileChange}
//                           className="hidden"
//                           id="file-upload"
//                         />
//                         <label
//                           htmlFor="file-upload"
//                           className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
//                         >
//                           انتخاب فایل
//                         </label>
//                         {form.watch("idCardPhoto") && (
//                           <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                             <p className="text-sm text-green-600 dark:text-green-400 font-medium">
//                               ✓ فایل انتخاب شد:{" "}
//                               {form.watch("idCardPhoto")?.name}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </Form>
//           </div>
//         </div>

//         {/* Video Verification Section */}
//         <div className="order-1 xl:order-2">
//           <VideoVerification
//             firstName={userInfo.firstName}
//             lastName={userInfo.lastName}
//             onVerificationComplete={handleVideoVerification}
//           />
//         </div>
//       </div>

//       {/* Form Actions at Bottom */}
//       <div className="border-t border-gray-200 dark:border-gray-700 pt-6 lg:pt-8 mt-8">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Summary Info */}
//             <div className="text-center space-y-4">
//               <div className="flex items-center justify-center gap-4 lg:gap-8 flex-wrap">
//                 {form.watch("idCardPhoto") ? (
//                   <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
//                     <CheckCircle className="w-5 h-5" />
//                     <span className="font-medium">کارت ملی آپلود شد</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg">
//                     <Upload className="w-5 h-5" />
//                     <span className="font-medium">آپلود کارت ملی لازم است</span>
//                   </div>
//                 )}

//                 {videoVerificationComplete ? (
//                   <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
//                     <CheckCircle className="w-5 h-5" />
//                     <span className="font-medium">
//                       تأیید هویت ویدیویی انجام شد
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg">
//                     <Video className="w-5 h-5" />
//                     <span className="font-medium">
//                       تأیید هویت ویدیویی لازم است
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-6 max-w-md mx-auto">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={onBack}
//                 className="flex-1 py-3 px-6 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
//               >
//                 مرحله قبل
//               </Button>
//               <Button
//                 type="submit"
//                 className="flex-1 py-3 px-6 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={
//                   !form.watch("idCardPhoto") || !videoVerificationComplete
//                 }
//               >
//                 مرحله بعد
//                 <ArrowLeft className="mr-3 h-5 w-5" />
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </motion.div>
//   );
// }
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, CheckCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  step2Schema,
  type Step2FormData,
  type Step1FormData,
} from "@/types/registration";
import { VideoVerification } from "./VideoVerification";
import { useTranslation } from "react-i18next";

interface Step2IdCardUploadProps {
  onSubmit: (data: Step2FormData) => void;
  onBack: () => void;
  userInfo: Step1FormData;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export function Step2IdCardUpload({
  onSubmit,
  onBack,
  userInfo,
}: Step2IdCardUploadProps) {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [videoVerificationComplete, setVideoVerificationComplete] =
    useState(false);

  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      idCardPhoto: undefined,
      videoVerification: {
        videoBlob: undefined,
        isVerified: false,
        verificationStatus: "pending" as const,
        verificationMessage: undefined,
      },
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      form.setValue("idCardPhoto", e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue("idCardPhoto", e.target.files[0]);
    }
  };

  const handleVideoVerification = (verification: {
    videoBlob: Blob | null;
    isVerified: boolean;
    verificationStatus: "pending" | "approved" | "rejected";
    verificationMessage?: string;
  }) => {
    form.setValue("videoVerification", verification);
    setVideoVerificationComplete(verification.isVerified);
  };

  const selectedFileName = form.watch("idCardPhoto")?.name;

  return (
    <motion.div
      key="step2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t("step2.heading")}
        </h2>
        <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t("step2.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 mb-6 lg:mb-8">
        {/* ID Card Upload Section */}
        <div className="order-2 xl:order-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 lg:p-6 xl: p-8 border border-gray-200 dark:border-gray-700 h-full">
            <div className="mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Upload className="w-5 h-5 text-red-500" />
                {t("step2.title")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("step2.uploadInstruction")}
              </p>
            </div>
            <Form {...form}>
              <FormField
                control={form.control}
                name="idCardPhoto"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div
                        className={`border-2 border-dashed rounded-xl p-6 lg:p-8 text-center transition-all duration-200 ${
                          dragActive
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20 scale-105"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">
                          {t("step2.dropHint")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          {t("step2.orClickButton")}
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                        >
                          {t("step2.chooseFile")}
                        </label>
                        {selectedFileName && (
                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                              <CheckCircle className="inline-block w-4 h-4 ltr:mr-1 rtl:ml-1" />
                              {t("step2.fileChosen", { name: selectedFileName })}
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </div>
        </div>

        {/* Video Verification Section */}
        <div className="order-1 xl:order-2">
          <VideoVerification
            firstName={userInfo.firstName}
            lastName={userInfo.lastName}
            onVerificationComplete={handleVideoVerification}
          />
        </div>
      </div>

      {/* Form Actions at Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 lg:pt-8 mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Summary Info */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4 lg:gap-8 flex-wrap">
                {form.watch("idCardPhoto") ? (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{t("step2.summary.idUploaded")}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg">
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">{t("step2.summary.idRequired")}</span>
                  </div>
                )}

                {videoVerificationComplete ? (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      {t("step2.summary.videoDone")}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg">
                    <Video className="w-5 h-5" />
                    <span className="font-medium">
                      {t("step2.summary.videoRequired")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-6 max-w-md mx-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 py-3 px-6 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t("common.back")}
              </Button>
              <Button
                type="submit"
                className="flex-1 py-3 px-6 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                // disabled={!form.watch("idCardPhoto") || !videoVerificationComplete}
                disabled={!form.watch("idCardPhoto")}
              >
                {t("common.next")}
                <ArrowLeft className="ltr:mr-3 rtl:ml-3 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
