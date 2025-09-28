// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Phone, CheckCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form";
// import {
//   step3Schema,
//   type Step3FormData,
//   type PhoneNumber,
// } from "@/types/registration";
// import { Step3CustomNumber } from "./Step3PhoneNumberSearch";
// import { NumbersList } from "./NumbersList";
// import { SelectedNumbers } from "./SelectedNumbers";

// interface Step3PhoneSelectionProps {
//   onSubmit: (data: Step3FormData) => void;
//   onBack: () => void;
//   availableNumbers: PhoneNumber[];
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

// export function Step3PhoneSelection({
//   onSubmit,
//   onBack,
//   availableNumbers,
// }: Step3PhoneSelectionProps) {
//   const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);

//   const form = useForm<Step3FormData>({
//     resolver: zodResolver(step3Schema),
//     defaultValues: {
//       selectedNumbers: [],
//       acceptTerms: false,
//     },
//   });

//   const toggleNumberSelection = (number: string) => {
//     setSelectedNumbers((prev) => {
//       const isSelected = prev.includes(number);
//       const newSelected = isSelected
//         ? prev.filter((n) => n !== number)
//         : [...prev, number];

//       form.setValue("selectedNumbers", newSelected);
//       return newSelected;
//     });
//   };

//   const removeSelectedNumber = (number: string) => {
//     setSelectedNumbers((prev) => {
//       const newSelected = prev.filter((n) => n !== number);
//       form.setValue("selectedNumbers", newSelected);
//       return newSelected;
//     });
//   };

//   const handleAddCustomNumber = (customNumber: string) => {
//     // Check if number is already selected
//     if (selectedNumbers.includes(customNumber)) {
//       toast.error("این شماره قبلاً انتخاب شده است");
//       return;
//     }

//     setSelectedNumbers((prev) => {
//       const newSelected = [...prev, customNumber];
//       form.setValue("selectedNumbers", newSelected);
//       return newSelected;
//     });
//   };

//   return (
//     <motion.div
//       key="step3"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//       className="w-full"
//     >
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4">
//           <Phone className="w-8 h-8 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
//           انتخاب شماره تلفن
//         </h2>
//         <p className="text-lg text-gray-600 dark:text-gray-300">
//           شماره دلخواه خود را بسازید یا از شماره‌های پیشنهادی انتخاب کنید
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
//         {/* Custom Number Creation Section */}
//         <div className="space-y-6">
//           <Step3CustomNumber onAddCustomNumber={handleAddCustomNumber} />
//         </div>

//         {/* Suggested Numbers List */}
//         <div className="lg:col-span-1 xl:col-span-1">
//           <NumbersList
//             numbers={availableNumbers}
//             selectedNumbers={selectedNumbers}
//             onToggleSelection={toggleNumberSelection}
//             showSearchResults={false}
//             title="شماره‌های پیشنهادی"
//           />
//         </div>

//         {/* Selected Numbers */}
//         <div className="lg:col-span-1 xl:col-span-1">
//           <SelectedNumbers
//             selectedNumbers={selectedNumbers}
//             onRemoveNumber={removeSelectedNumber}
//           />
//         </div>
//       </div>

//       {/* Form Actions at Bottom */}
//       <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             {/* Terms and Conditions */}
//             <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//               <FormField
//                 control={form.control}
//                 name="acceptTerms"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                     <FormControl>
//                       <input
//                         type="checkbox"
//                         checked={field.value}
//                         onChange={field.onChange}
//                         className="mt-2 w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500"
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel className="text-lg font-medium text-gray-900 dark:text-white cursor-pointer">
//                         قوانین و مقررات را مطالعه کرده‌ام و قبول دارم.
//                       </FormLabel>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         برای ادامه، باید قوانین و مقررات خدمات را بپذیرید
//                       </p>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-6 max-w-lg mx-auto">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={onBack}
//                 className="flex-1 py-4 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50"
//               >
//                 مرحله قبل
//               </Button>
//               <Button
//                 type="submit"
//                 className="flex-1 py-4 px-8 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all"
//                 disabled={selectedNumbers.length === 0}
//               >
//                 مرحله بعد
//                 <CheckCircle className="mr-3 h-6 w-6" />
//               </Button>
//             </div>

//             {/* Summary Info */}
//             {selectedNumbers.length > 0 && (
//               <div className="text-center">
//                 <p className="text-lg text-gray-600 dark:text-gray-300">
//                   شما{" "}
//                   <span className="font-bold text-green-600">
//                     {selectedNumbers.length}
//                   </span>{" "}
//                   شماره انتخاب کرده‌اید
//                 </p>
//               </div>
//             )}
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
import { Phone,  ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  step3Schema,
  type Step3FormData,
  type PhoneNumber,
} from "@/types/registration";
import { Step3CustomNumber } from "./Step3PhoneNumberSearch";
import { NumbersList } from "./NumbersList";
import { SelectedNumbers } from "./SelectedNumbers";
import { useTranslation } from "react-i18next";

interface Step3PhoneSelectionProps {
  onSubmit: (data: Step3FormData) => void;
  onBack: () => void;
  availableNumbers: PhoneNumber[];
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

export function Step3PhoneSelection({
  onSubmit,
  onBack,
  availableNumbers,
}: Step3PhoneSelectionProps) {
  const { t } = useTranslation();
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);

  const form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      selectedNumbers: [],
      acceptTerms: false,
    },
  });

  const toggleNumberSelection = (number: string) => {
    setSelectedNumbers((prev) => {
      const isSelected = prev.includes(number);
      const newSelected = isSelected
        ? prev.filter((n) => n !== number)
        : [...prev, number];

      form.setValue("selectedNumbers", newSelected);
      return newSelected;
    });
  };

  const removeSelectedNumber = (number: string) => {
    setSelectedNumbers((prev) => {
      const newSelected = prev.filter((n) => n !== number);
      form.setValue("selectedNumbers", newSelected);
      return newSelected;
    });
  };

  const handleAddCustomNumber = (customNumber: string) => {
    if (selectedNumbers.includes(customNumber)) {
      toast.error(t("step3.toasts.alreadySelected"));
      return;
    }
    setSelectedNumbers((prev) => {
      const newSelected = [...prev, customNumber];
      form.setValue("selectedNumbers", newSelected);
      return newSelected;
    });
  };

  return (
    <motion.div
      key="step3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t("step3.title")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("step3.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2  gap-4 lg:gap-6 xl:gap-8">
        {/* Custom Number Creation Section */}
        <div className="space-y-6">
          <Step3CustomNumber onAddCustomNumber={handleAddCustomNumber} />
        </div>

        {/* Suggested Numbers List */}
        <div className="lg:col-span-1 xl:col-span-1">
          <NumbersList
            numbers={availableNumbers}
            selectedNumbers={selectedNumbers}
            onToggleSelection={toggleNumberSelection}
            showSearchResults={false}
            title={t("step3.suggested.title")}
          />
        </div>

        {/* Selected Numbers */}
        <div className="lg:col-span-1 xl:col-span-2">
          <SelectedNumbers
            selectedNumbers={selectedNumbers}
            onRemoveNumber={removeSelectedNumber}
          />
        </div>
      </div>

      {/* Form Actions at Bottom */}
      <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Terms and Conditions */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-2 w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-lg font-medium text-gray-900 dark:text-white cursor-pointer">
                        {t("step3.terms.label")}
                      </FormLabel>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("step3.terms.helper")}
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-6 max-w-lg mx-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 py-4 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50"
              >
                {t("common.back")}
              </Button>
              <Button
                type="submit"
                className="flex-1 py-4 px-8 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedNumbers.length === 0}
              >
                {t("common.next")}
                <ArrowLeft className="ltr:mr-3 rtl:ml-3 h-5 w-5" />
              </Button>
            </div>

            {/* Summary Info */}
            {selectedNumbers.length > 0 && (
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t("step3.summary.selectedCount", {
                    count: selectedNumbers.length,
                  })}
                </p>
              </div>
            )}
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
