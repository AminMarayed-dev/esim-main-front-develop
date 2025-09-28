// import { motion } from "framer-motion";
// import { CheckCircle, Star, X } from "lucide-react";

// interface SelectedNumbersProps {
//   selectedNumbers: string[];
//   onRemoveNumber: (number: string) => void;
// }

// export function SelectedNumbers({
//   selectedNumbers,
//   onRemoveNumber,
// }: SelectedNumbersProps) {
//   return (
//     <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 p-8 h-full">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="p-2 bg-green-500 rounded-lg">
//           <CheckCircle className="w-6 h-6 text-white" />
//         </div>
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           شماره‌های انتخاب شده
//         </h3>
//         {selectedNumbers.length > 0 && (
//           <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
//             {selectedNumbers.length}
//           </span>
//         )}
//       </div>

//       {selectedNumbers.length === 0 ? (
//         <div className="text-center py-12">
//           <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
//           <p className="text-lg text-gray-500 dark:text-gray-400">
//             هنوز شماره‌ای انتخاب نکرده‌اید
//           </p>
//           <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
//             از لیست کنار شماره‌های موردنظر خود را انتخاب کنید
//           </p>
//         </div>
//       ) : (
//         <div className="max-h-[500px] overflow-y-auto">
//           <div className="space-y-3">
//             {selectedNumbers.map((number) => (
//               <motion.div
//                 key={number}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-xl border-2 border-green-200 dark:border-green-600 shadow-sm"
//               >
//                 <div className="flex items-center gap-3">
//                   <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
//                   <span className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
//                     {number}
//                   </span>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => onRemoveNumber(number)}
//                   className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { motion } from "framer-motion";
import { CheckCircle, Star, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SelectedNumbersProps {
  selectedNumbers: string[];
  onRemoveNumber: (number: string) => void;
}

export function SelectedNumbers({
  selectedNumbers,
  onRemoveNumber,
}: SelectedNumbersProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 p-8 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500 rounded-lg">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("step3.selected.title")}
        </h3>
        {selectedNumbers.length > 0 && (
          <span
            className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold"
            aria-label={t("step3.summary.selectedCount", {
              count: selectedNumbers.length,
            })}
          >
            {selectedNumbers.length}
          </span>
        )}
      </div>

      {selectedNumbers.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {t("step3.selected.emptyTitle")}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {t("step3.selected.emptySubtitle")}
          </p>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto">
          <div className="space-y-3">
            {selectedNumbers.map((number) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-xl border-2 border-green-200 dark:border-green-600 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span
                    className="text-lg font-mono font-semibold text-gray-900 dark:text-white"
                    dir="ltr"
                  >
                    {number}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveNumber(number)}
                  title={t("step3.selected.removeAria", { number })}
                  aria-label={t("step3.selected.removeAria", { number })}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
