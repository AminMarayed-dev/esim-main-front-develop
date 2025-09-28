// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Settings,
//   CheckCircle,
//   Check,
//   HelpCircle,
//   Smartphone,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import {
//   step4Schema,
//   type Step4FormData,
//   AVAILABLE_SERVICES,
//   ESIM_LINE_TYPES,
// } from "@/types/registration";

// interface Step4ServiceSelectionProps {
//   onSubmit: (data: Step4FormData) => void;
//   onBack: () => void;
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

// const serviceItemVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: (index: number) => ({
//     opacity: 1,
//     x: 0,
//     transition: {
//       delay: index * 0.1,
//       duration: 0.5,
//     },
//   }),
// };

// export function Step4ServiceSelection({
//   onSubmit,
//   onBack,
// }: Step4ServiceSelectionProps) {
//   const [selectedServices, setSelectedServices] = useState<string[]>([]);
//   const [selectedEsimType, setSelectedEsimType] = useState<string>("");
//   const [isFirstSimCard, setIsFirstSimCard] = useState<boolean | null>(null);

//   const form = useForm<Step4FormData>({
//     resolver: zodResolver(step4Schema),
//     defaultValues: {
//       selectedServices: [],
//       esimLineType: "",
//       isFirstSimCard: false,
//     },
//   });

//   const toggleServiceSelection = (service: string) => {
//     setSelectedServices((prev) => {
//       const isSelected = prev.includes(service);
//       const newSelected = isSelected
//         ? prev.filter((s) => s !== service)
//         : [...prev, service];

//       form.setValue("selectedServices", newSelected);
//       return newSelected;
//     });
//   };

//   const handleEsimTypeSelection = (esimType: string) => {
//     const newSelection = selectedEsimType === esimType ? "" : esimType;
//     setSelectedEsimType(newSelection);
//     form.setValue("esimLineType", newSelection);
//   };

//   const handleFirstSimCardSelection = (isFirst: boolean) => {
//     setIsFirstSimCard(isFirst);
//     form.setValue("isFirstSimCard", isFirst);
//   };

//   return (
//     <motion.div
//       key="step4"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//       className="w-full"
//     >
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4">
//           <Settings className="w-8 h-8 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
//           انتخاب سرویس‌ها
//         </h2>
//         <p className="text-lg text-gray-600 dark:text-gray-300">
//           سرویس‌های موردنیاز خود را انتخاب کنید
//         </p>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           {/* Section 1: eSIM Line Type Selection (Optional) */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-6"
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-2 bg-blue-500 rounded-lg">
//                 <Smartphone className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                 نوع خط eSIM
//               </h3>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {ESIM_LINE_TYPES.map((esimType, index) => (
//                 <motion.div
//                   key={esimType}
//                   custom={index}
//                   variants={serviceItemVariants}
//                   initial="hidden"
//                   animate="visible"
//                   className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
//                     selectedEsimType === esimType
//                       ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
//                       : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300"
//                   }`}
//                   onClick={() => handleEsimTypeSelection(esimType)}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
//                         selectedEsimType === esimType
//                           ? "border-blue-500 bg-blue-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                     >
//                       {selectedEsimType === esimType && (
//                         <div className="w-3 h-3 bg-white rounded-full" />
//                       )}
//                     </div>
//                     <label className="block text-base font-medium text-gray-900 dark:text-white cursor-pointer leading-relaxed">
//                       {esimType}
//                     </label>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Section 2: First SIM Card Question */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="bg-gradient-to-r from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700 p-6"
//           >
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-2 bg-purple-500 rounded-lg">
//                 <HelpCircle className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                 آیا شما سیم کارت اولی هستین؟
//               </h3>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {[
//                 { value: true, label: "بله" },
//                 { value: false, label: "خیر" },
//               ].map((option, index) => (
//                 <motion.div
//                   key={option.label}
//                   custom={index}
//                   variants={serviceItemVariants}
//                   initial="hidden"
//                   animate="visible"
//                   className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
//                     isFirstSimCard === option.value
//                       ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
//                       : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300"
//                   }`}
//                   onClick={() => handleFirstSimCardSelection(option.value)}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
//                         isFirstSimCard === option.value
//                           ? "border-purple-500 bg-purple-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                     >
//                       {isFirstSimCard === option.value && (
//                         <div className="w-3 h-3 bg-white rounded-full" />
//                       )}
//                     </div>
//                     <label className="block text-lg font-medium text-gray-900 dark:text-white cursor-pointer leading-relaxed">
//                       {option.label}
//                     </label>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Section 3: Services Selection */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-700 p-6"
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 bg-red-500 rounded-lg">
//                 <Settings className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                   سرویس‌های موجود (اختیاری)
//                 </h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   تمام سرویس‌ها رایگان هستند
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//               {AVAILABLE_SERVICES.map((service, index) => (
//                 <motion.div
//                   key={service}
//                   custom={index}
//                   variants={serviceItemVariants}
//                   initial="hidden"
//                   animate="visible"
//                   className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
//                     selectedServices.includes(service)
//                       ? "border-red-500 bg-red-50 dark:bg-red-900/30"
//                       : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-red-300"
//                   }`}
//                   onClick={() => toggleServiceSelection(service)}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div
//                       className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
//                         selectedServices.includes(service)
//                           ? "border-red-500 bg-red-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                     >
//                       {selectedServices.includes(service) && (
//                         <Check className="w-4 h-4 text-white" />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <label className="block text-base font-medium text-gray-900 dark:text-white cursor-pointer leading-relaxed">
//                         {service}
//                       </label>
//                     </div>
//                   </div>

//                   {/* Selection indicator */}
//                   {selectedServices.includes(service) && (
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
//                     >
//                       <Check className="w-4 h-4 text-white" />
//                     </motion.div>
//                   )}
//                 </motion.div>
//               ))}
//             </div>

//             {/* Selected Services Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-6"
//             >
//               {selectedServices.length > 0 && (
//                 <div className="bg-red-100 dark:bg-red-800/30 rounded-lg p-4">
//                   <p className="text-base font-medium text-red-800 dark:text-red-200">
//                     شما{" "}
//                     <span className="font-bold">{selectedServices.length}</span>{" "}
//                     سرویس انتخاب کرده‌اید
//                   </p>
//                 </div>
//               )}
//             </motion.div>
//           </motion.div>

//           {/* Hidden Form Fields for Validation */}
//           <FormField
//             control={form.control}
//             name="selectedServices"
//             render={() => (
//               <FormItem className="hidden">
//                 <FormControl>
//                   <input type="hidden" />
//                 </FormControl>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="esimLineType"
//             render={() => (
//               <FormItem className="hidden">
//                 <FormControl>
//                   <input type="hidden" />
//                 </FormControl>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="isFirstSimCard"
//             render={() => (
//               <FormItem className="hidden">
//                 <FormControl>
//                   <input type="hidden" />
//                 </FormControl>
//               </FormItem>
//             )}
//           />

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-6 max-w-lg mx-auto pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onBack}
//               className="flex-1 py-4 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
//             >
//               مرحله قبل
//             </Button>
//             <Button
//               type="submit"
//               className="flex-1 py-4 px-8 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all"
//               disabled={selectedEsimType === "" || isFirstSimCard === null}
//             >
//               تکمیل ثبت نام
//               <CheckCircle className="mr-3 h-6 w-6" />
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </motion.div>
//   );
// }

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Settings,
  Check,
  HelpCircle,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  step4Schema,
  type Step4FormData,
  AVAILABLE_SERVICES,
  ESIM_LINE_TYPES,
} from "@/types/registration";
import { useTranslation } from "react-i18next";

interface Step4ServiceSelectionProps {
  onSubmit: (data: Step4FormData) => void;
  onBack: () => void;
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

const serviceItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
    },
  }),
};

export function Step4ServiceSelection({
  onSubmit,
  onBack,
}: Step4ServiceSelectionProps) {
  const { t } = useTranslation();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedEsimType, setSelectedEsimType] = useState<string>("");
  const [isFirstSimCard, setIsFirstSimCard] = useState<boolean | null>(null);

  const form = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      selectedServices: [],
      esimLineType: "",
      isFirstSimCard: false,
    },
  });

  const toggleServiceSelection = (service: string) => {
    setSelectedServices((prev) => {
      const isSelected = prev.includes(service);
      const newSelected = isSelected
        ? prev.filter((s) => s !== service)
        : [...prev, service];

      form.setValue("selectedServices", newSelected);
      return newSelected;
    });
  };

  const handleEsimTypeSelection = (esimType: string) => {
    const newSelection = selectedEsimType === esimType ? "" : esimType;
    setSelectedEsimType(newSelection);
    form.setValue("esimLineType", newSelection);
  };

  const handleFirstSimCardSelection = (isFirst: boolean) => {
    setIsFirstSimCard(isFirst);
    form.setValue("isFirstSimCard", isFirst);
  };

  return (
    <motion.div
      key="step4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t("step4.title")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("step4.subtitle")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: eSIM Line Type Selection (Optional) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("step4.esimLineTypeTitle")}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ESIM_LINE_TYPES.map((esimType, index) => (
                <motion.div
                  key={esimType}
                  custom={index}
                  variants={serviceItemVariants}
                  initial="hidden"
                  animate="visible"
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedEsimType === esimType
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300"
                  }`}
                  onClick={() => handleEsimTypeSelection(esimType)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedEsimType === esimType
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {selectedEsimType === esimType && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <label className="block text-base font-medium text-gray-900 dark:text-white cursor-pointer leading-relaxed">
                      {t(`step4.esimLineTypes.${esimType}`, {
                        defaultValue: esimType,
                      })}
                    </label>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Section 2: First SIM Card Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500 rounded-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("step4.firstSimCardTitle")}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: true, label: t("common.yes") },
                { value: false, label: t("common.no") },
              ].map((option, index) => (
                <motion.div
                  key={String(option.value)}
                  custom={index}
                  variants={serviceItemVariants}
                  initial="hidden"
                  animate="visible"
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    isFirstSimCard === option.value
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300"
                  }`}
                  onClick={() => handleFirstSimCardSelection(option.value)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isFirstSimCard === option.value
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isFirstSimCard === option.value && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <label className="block text-lg font-medium text-gray-900 dark:text-white cursor-pointer leading-relaxed">
                      {option.label}
                    </label>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Section 3: Services Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-700 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("step4.availableServices.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("step4.availableServices.note")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {AVAILABLE_SERVICES.map((service, index) => (
                <motion.div
                  key={service}
                  custom={index}
                  variants={serviceItemVariants}
                  initial="hidden"
                  animate="visible"
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedServices.includes(service)
                      ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-red-300"
                  }`}
                  onClick={() => toggleServiceSelection(service)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        selectedServices.includes(service)
                          ? "border-red-500 bg-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {selectedServices.includes(service) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-base font-medium text-gray-900 dark:text-white cursor-pointer leading-relaxed">
                        {t(`services.${service}`, { defaultValue: service })}
                      </label>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedServices.includes(service) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Selected Services Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {selectedServices.length > 0 && (
                <div className="bg-red-100 dark:bg-red-800/30 rounded-lg p-4">
                  <p className="text-base font-medium text-red-800 dark:text-red-200">
                    {t("step4.summary.selectedCount", {
                      count: selectedServices.length,
                    })}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Hidden Form Fields for Validation */}
          <FormField
            control={form.control}
            name="selectedServices"
            render={() => (
              <FormItem className="hidden">
                <FormControl>
                  <input type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="esimLineType"
            render={() => (
              <FormItem className="hidden">
                <FormControl>
                  <input type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFirstSimCard"
            render={() => (
              <FormItem className="hidden">
                <FormControl>
                  <input type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-6 max-w-lg mx-auto pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 py-4 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {t("common.back")}
            </Button>
            <Button
              type="submit"
              className="flex-1 py-4 px-8 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedEsimType === "" || isFirstSimCard === null}
            >
              {t("common.next")}
              <ArrowLeft className="ltr:mr-3 rtl:ml-3 h-5 w-5" />
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
