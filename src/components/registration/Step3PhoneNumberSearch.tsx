// import { useState } from "react";
// import { Phone, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";

// interface Step3CustomNumberProps {
//   onAddCustomNumber: (fullNumber: string) => void;
// }

// export function Step3CustomNumber({
//   onAddCustomNumber,
// }: Step3CustomNumberProps) {
//   const [digits, setDigits] = useState<string[]>(["", "", "", "", "", "", ""]);

//   // Handle digit input change
//   const handleDigitChange = (index: number, value: string) => {
//     if (value.length <= 1 && /^\d*$/.test(value)) {
//       const newDigits = [...digits];
//       newDigits[index] = value;
//       setDigits(newDigits);

//       // Auto-focus next input if digit is entered
//       if (value && index < 6) {
//         const nextInput = document.getElementById(`custom-digit-${index + 1}`);
//         nextInput?.focus();
//       }
//     }
//   };

//   // Handle backspace for better UX
//   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === "Backspace" && !digits[index] && index > 0) {
//       const prevInput = document.getElementById(`custom-digit-${index - 1}`);
//       prevInput?.focus();
//     }
//   };

//   // Handle adding custom number
//   const handleAddNumber = () => {
//     const digitString = digits.join("");
//     if (digitString.length !== 6) {
//       toast.error("لطفاً تمام 6 رقم را وارد کنید");
//       return;
//     }

//     const fullNumber = "09999" + digitString;
//     onAddCustomNumber(fullNumber);

//     // Clear the inputs after adding
//     setDigits(["", "", "", "", "", "", ""]);

//     // Focus first input
//     const firstInput = document.getElementById("custom-digit-0");
//     firstInput?.focus();

//     toast.success("شماره به لیست اضافه شد");
//   };

//   // Clear inputs
//   const clearInputs = () => {
//     setDigits(["", "", "", "", "", ""]);
//     const firstInput = document.getElementById("custom-digit-0");
//     firstInput?.focus();
//   };

//   const digitString = digits.join("");
//   const isComplete = digitString.length === 6;

//   return (
//     <div className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-700 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="p-2 bg-red-500 rounded-lg">
//           <Phone className="w-6 h-6 text-white" />
//         </div>
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           ساخت شماره دلخواه
//         </h3>
//       </div>

//       <div className="space-y-6">
//         {/* Prefix Display */}
//         <div>
//           <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
//             پیش شماره ثابت
//           </label>
//           <div className="flex items-center justify-center">
//             <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-lg text-2xl font-bold border-2 border-gray-200 dark:border-gray-600">
//               09999
//             </div>
//           </div>
//         </div>

//         {/* 7 Digit Input Boxes */}
//         <div>
//           <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
//             رقم‌های دلخواه (6 رقم)
//           </label>
//           <div
//             className="flex gap-1 sm:gap-2 justify-center overflow-x-auto"
//             dir="ltr"
//           >
//             {digits.map((digit, index) => (
//               <Input
//                 key={index}
//                 id={`custom-digit-${index}`}
//                 type="text"
//                 value={digit}
//                 onChange={(e) => handleDigitChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 className="w-10 sm:w-12 h-10 sm:h-12 text-center text-sm sm:text-lg font-bold border-2 focus:border-red-500 flex-shrink-0"
//                 maxLength={1}
//                 placeholder="۰"
//               />
//             ))}
//           </div>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
//             هر کادر یک رقم وارد کنید
//           </p>
//         </div>

//         {/* Preview */}
//         <div className="text-center">
//           <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//             پیش‌نمایش شماره:
//           </p>
//           <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3">
//             <span
//               className="text-xl font-mono text-gray-800 dark:text-gray-200"
//               dir="ltr"
//             >
//               09999{digitString}
//               {!isComplete && (
//                 <span className="text-gray-400">
//                   {"_".repeat(6 - digitString.length)}
//                 </span>
//               )}
//             </span>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-2">
//           <Button
//             type="button"
//             onClick={handleAddNumber}
//             disabled={!isComplete}
//             className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             افزودن به لیست
//           </Button>
//           <Button type="button" variant="outline" onClick={clearInputs}>
//             پاک کردن
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Step3CustomNumberProps {
  onAddCustomNumber: (fullNumber: string) => void;
}

export function Step3CustomNumber({ onAddCustomNumber }: Step3CustomNumberProps) {
  const { t } = useTranslation();

  // 6 custom digits after the fixed prefix
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newDigits = [...digits];
      newDigits[index] = value;
      setDigits(newDigits);

      if (value && index < digits.length - 1) {
        const nextInput = document.getElementById(`custom-digit-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`custom-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAddNumber = () => {
    const digitString = digits.join("");
    if (digitString.length !== 6) {
      toast.error(t("step3.customNumber.errors.incompleteDigits"));
      return;
    }

    const fullNumber = "09999" + digitString;
    onAddCustomNumber(fullNumber);

    setDigits(["", "", "", "", "", ""]);
    const firstInput = document.getElementById("custom-digit-0");
    firstInput?.focus();

    toast.success(t("step3.customNumber.toasts.added"));
  };

  const clearInputs = () => {
    setDigits(["", "", "", "", "", ""]);
    const firstInput = document.getElementById("custom-digit-0");
    firstInput?.focus();
  };

  const digitString = digits.join("");
  const isComplete = digitString.length === 6;

  return (
    <div className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-700 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-500 rounded-lg">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("step3.customNumber.title")}
        </h3>
      </div>

      <div className="space-y-6">
        {/* Prefix Display */}
        <div>
          <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t("step3.customNumber.prefixLabel")}
          </label>
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-lg text-2xl font-bold border-2 border-gray-200 dark:border-gray-600">
              09999
            </div>
          </div>
        </div>

        {/* 6 Digit Input Boxes */}
        <div>
          <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t("step3.customNumber.digitsLabel")}
          </label>
          <div className="flex gap-1 sm:gap-2 justify-center overflow-x-auto" dir="ltr">
            {digits.map((digit, index) => (
              <Input
                key={index}
                id={`custom-digit-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 sm:w-12 h-10 sm:h-12 text-center text-sm sm:text-lg font-bold border-2 focus:border-red-500 flex-shrink-0"
                maxLength={1}
                placeholder="۰"
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            {t("step3.customNumber.digitsHelper")}
          </p>
        </div>

        {/* Preview */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t("step3.customNumber.previewLabel")}
          </p>
          <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3">
            <span className="text-xl font-mono text-gray-800 dark:text-gray-200" dir="ltr">
              09999{digitString}
              {!isComplete && <span className="text-gray-400">{"_".repeat(6 - digitString.length)}</span>}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleAddNumber}
            disabled={!isComplete}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            {t("step3.customNumber.addButton")}
          </Button>
          <Button type="button" variant="outline" onClick={clearInputs}>
            {t("common.clear")}
          </Button>
        </div>
      </div>
    </div>
  );
}
