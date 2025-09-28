// import { motion } from "framer-motion";
// import {
//   CheckCircle,
//   Gift,
//   Sparkles,
//   ExternalLink,
//   Phone,
//   Users,
//   Star,
//   ArrowRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface RegistrationSuccessProps {
//   firstName: string;
//   lastName: string;
//   selectedNumbers: string[];
//   onNewRegistration: () => void;
// }

// const containerVariants = {
//   hidden: { opacity: 0, scale: 0.8 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.6,
//       type: "spring" as const,
//       stiffness: 100,
//       damping: 15,
//     },
//   },
// };

// const confettiVariants = {
//   hidden: { opacity: 0, y: -50 },
//   visible: (index: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: index * 0.1,
//       duration: 0.8,
//       repeat: Infinity,
//       repeatType: "reverse" as const,
//       ease: [0.4, 0, 0.2, 1] as const,
//     },
//   }),
// };

// const numberItemVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: (index: number) => ({
//     opacity: 1,
//     x: 0,
//     transition: {
//       delay: 0.5 + index * 0.1,
//       duration: 0.5,
//       type: "spring" as const,
//     },
//   }),
// };

// export function RegistrationSuccess({
//   firstName,
//   lastName,
//   selectedNumbers,
//   onNewRegistration,
// }: RegistrationSuccessProps) {
//   const confettiEmojis = ["🎉", "✨", "🎊", "⭐", "💫", "🌟"];

//   return (
//     <motion.div
//       key="success"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="text-center space-y-8 relative overflow-hidden"
//     >
//       {/* Animated Confetti Background */}
//       <div className="absolute inset-0 pointer-events-none">
//         {confettiEmojis.map((emoji, index) => (
//           <motion.div
//             key={index}
//             custom={index}
//             variants={confettiVariants}
//             initial="hidden"
//             animate="visible"
//             className="absolute text-4xl"
//             style={{
//               left: `${10 + index * 15}%`,
//               top: `${5 + (index % 3) * 10}%`,
//             }}
//           >
//             {emoji}
//           </motion.div>
//         ))}
//       </div>

//       {/* Success Logo & Animation */}
//       <div className="relative">
//         <motion.div
//           initial={{ scale: 0, rotate: -180 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{
//             delay: 0.2,
//             duration: 0.8,
//             type: "spring" as const,
//             stiffness: 150,
//           }}
//           className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-full mb-6 shadow-2xl relative"
//         >
//           <CheckCircle className="w-16 h-16 text-white" />

//           {/* Sparkle animations around the logo */}
//           {[...Array(8)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute"
//               style={{
//                 left: `${50 + 45 * Math.cos((i * Math.PI) / 4)}%`,
//                 top: `${50 + 45 * Math.sin((i * Math.PI) / 4)}%`,
//               }}
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [0.6, 1, 0.6],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 delay: i * 0.2,
//               }}
//             >
//               <Sparkles className="w-4 h-4 text-yellow-400" />
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Dariya Cell Logo */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5, duration: 0.6 }}
//           className="mb-4"
//         >
//           <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 px-6 py-3 rounded-full border border-red-200 dark:border-red-700">
//             <Gift className="w-6 h-6 text-red-600" />
//             <span className="text-lg font-bold text-gray-900 dark:text-white">
//               🎉 تبریک! 🎉
//             </span>
//           </div>
//         </motion.div>
//       </div>

//       {/* Main Congratulations Message */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.7, duration: 0.6 }}
//         className="space-y-4"
//       >
//         <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-black to-red-600 bg-clip-text text-transparent">
//           ثبت نام با موفقیت انجام شد!
//         </h1>

//         <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-700 max-w-2xl mx-auto">
//           <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
//           <span className="text-red-600 dark:text-red-400 font-bold">
//               {firstName} {lastName}
//             </span>
//             عزیز{" "}

//             ، خوش آمدید!
//           </p>
//           <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
//             🌟 به خانواده بزرگ داریا سل خوش آمدید 🌟
//           </p>
//         </div>
//       </motion.div>

//       {/* Selected Numbers Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.9, duration: 0.6 }}
//         className="space-y-6"
//       >
//         <div className="flex items-center justify-center gap-3 mb-4">
//           <Phone className="w-6 h-6 text-red-600" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             شماره‌های ثبت نام شده شما:
//           </h2>
//         </div>

//         <div className="grid gap-4 max-w-lg mx-auto">
//           {selectedNumbers.map((number, index) => (
//             <motion.div
//               key={number}
//               custom={index}
//               variants={numberItemVariants}
//               initial="hidden"
//               animate="visible"
//               className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-shadow"
//             >
//               <div className="flex items-center justify-center gap-3">
//                 <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//                   <span className="text-white font-bold text-sm">
//                     {index + 1}
//                   </span>
//                 </div>
//                 <span className="text-xl font-bold font-mono text-gray-900 dark:text-white direction-ltr">
//                   {number}
//                 </span>
//                 <Star className="w-5 h-5 text-yellow-500" />
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1.2, duration: 0.6 }}
//           className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700 max-w-md mx-auto"
//         >
//           <p className="text-sm text-gray-700 dark:text-gray-300">
//             📱 شما مجموعاً{" "}
//             <span className="font-bold text-red-600">
//               {selectedNumbers.length}
//             </span>{" "}
//             شماره انتخاب کرده‌اید
//           </p>
//         </motion.div>
//       </motion.div>

//       {/* Dashboard Access Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.4, duration: 0.6 }}
//         className="space-y-6"
//       >
//         <div className="bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-900/20 dark:to-gray-900/20 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <Users className="w-6 h-6 text-gray-600" />
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//               مدیریت سیم کارت‌های خود
//             </h3>
//           </div>

//           <p className="text-gray-600 dark:text-gray-300 mb-6">
//             از طریق داشبورد اختصاصی داریا سل، می‌توانید تمامی سیم کارت‌های خود
//             را مدیریت کنید
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4 text-green-500" />
//               مشاهده مصرف داده
//             </div>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4 text-green-500" />
//               مدیریت بسته‌ها
//             </div>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4 text-green-500" />
//               تاریخچه تراکنش‌ها
//             </div>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4 text-green-500" />
//               پشتیبانی ۲۴/۷
//             </div>
//           </div>

//           <Button
//             className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all group"
//             onClick={() => window.open("https://esim-demo.vercel.app/", "_blank")}
//           >
//             <Users className="mr-3 h-6 w-6" />
//             ورود به داشبورد مدیریت
//             <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//             <ExternalLink className="ml-2 h-4 w-4" />
//           </Button>
//         </div>
//       </motion.div>

//       {/* Additional Actions */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.6, duration: 0.6 }}
//         className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700"
//       >
//         <p className="text-gray-600 dark:text-gray-300">
//           آیا می‌خواهید برای شخص دیگری هم ثبت نام کنید؟
//         </p>

//         <Button
//           variant="outline"
//           onClick={onNewRegistration}
//           className="py-3 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
//         >
//           ثبت نام جدید
//           <ArrowRight className="mr-3 h-5 w-5" />
//         </Button>
//       </motion.div>

//       {/* Footer Message */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1.8, duration: 0.6 }}
//         className="text-center pt-6"
//       >
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//         اولین شبکه ی eSIM ایران با نام داریا سل متعلق به شرکت تبادل و تحلیل هوشمند داریا می باشد
//         </p>
//       </motion.div>
//     </motion.div>
//   );
// }


import { motion } from "framer-motion";
import {
  CheckCircle,
  Gift,
  Sparkles,
  ExternalLink,
  Phone,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface RegistrationSuccessProps {
  firstName: string;
  lastName: string;
  selectedNumbers: string[];
  onNewRegistration: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

const confettiVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

const numberItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.5 + index * 0.1, duration: 0.5, type: "spring" as const },
  }),
};

export function RegistrationSuccess({
  firstName,
  lastName,
  selectedNumbers,
  onNewRegistration,
}: RegistrationSuccessProps) {
  const { t } = useTranslation();
  const confettiEmojis = ["🎉", "✨", "🎊", "⭐", "💫", "🌟"];

  return (
    <motion.div
      key="success"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-8 relative overflow-hidden"
    >
      {/* Animated Confetti Background */}
      <div className="absolute inset-0 pointer-events-none">
        {confettiEmojis.map((emoji, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={confettiVariants}
            initial="hidden"
            animate="visible"
            className="absolute text-4xl"
            style={{ left: `${10 + index * 15}%`, top: `${5 + (index % 3) * 10}%` }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Success Logo & Animation */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" as const, stiffness: 150 }}
          className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-full mb-6 shadow-2xl relative"
        >
          <CheckCircle className="w-16 h-16 text-white" />

          {/* Sparkles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${50 + 45 * Math.cos((i * Math.PI) / 4)}%`,
                top: `${50 + 45 * Math.sin((i * Math.PI) / 4)}%`,
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          ))}
        </motion.div>

        {/* Congrats badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mb-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 px-6 py-3 rounded-full border border-red-200 dark:border-red-700">
            <Gift className="w-6 h-6 text-red-600" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              🎉 {t("success.badge")} 🎉
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main message */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-black to-red-600 bg-clip-text text-transparent">
          {t("success.title")}
        </h1>

        <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-700 max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
            <span className="text-red-600 dark:text-red-400 font-bold">
              {t("success.welcome", { firstName, lastName })}
            </span>
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            🌟 {t("success.welcomeFamily")} 🌟
          </p>
        </div>
      </motion.div>

      {/* Selected numbers */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Phone className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("success.numbers.title")}
          </h2>
        </div>

        <div className="grid gap-4 max-w-lg mx-auto">
          {selectedNumbers.map((number, index) => (
            <motion.div
              key={number}
              custom={index}
              variants={numberItemVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <span className="text-xl font-bold font-mono text-gray-900 dark:text-white direction-ltr">
                  {number}
                </span>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }} className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700 max-w-md mx-auto">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            📱 {t("success.numbers.selectedCount", { count: selectedNumbers.length })}
          </p>
        </motion.div>
      </motion.div>

      {/* Dashboard access */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6 }} className="space-y-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-900/20 dark:to-gray-900/20 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-6 h-6 text-gray-600" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("success.dashboard.title")}
            </h3>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{t("success.dashboard.desc")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{t("success.dashboard.features.dataUsage")}</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{t("success.dashboard.features.packages")}</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{t("success.dashboard.features.transactions")}</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{t("success.dashboard.features.support")}</div>
          </div>

          <Button
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all group"
            onClick={() => window.open("https://esim-demo.vercel.app/", "_blank")}
          >
            <Users className="mr-3 h-6 w-6" />
            {t("success.dashboard.cta")}
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* More actions */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.6 }} className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300">{t("success.more.question")}</p>

        <Button
          variant="outline"
          onClick={onNewRegistration}
          className="py-3 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          {t("success.more.newRegistration")}
          <ArrowRight className="mr-3 h-5 w-5" />
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }} className="text-center pt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("success.footer")}</p>
      </motion.div>
    </motion.div>
  );
}

