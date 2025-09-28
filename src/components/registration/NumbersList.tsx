import { motion } from "framer-motion";
import { Star, CheckCircle, AlertCircle } from "lucide-react";
import { type PhoneNumber } from "@/types/registration";

interface NumbersListProps {
  numbers: PhoneNumber[];
  selectedNumbers: string[];
  onToggleSelection: (number: string) => void;
  showSearchResults: boolean;
  title: string;
}

export function NumbersList({
  numbers,
  selectedNumbers,
  onToggleSelection,
  showSearchResults,
  title,
}: NumbersListProps) {
  if (showSearchResults && numbers.length === 0) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700 p-8 h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500 rounded-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>

        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            شماره‌ای با مشخصات وارد شده یافت نشد
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700 p-8 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500 rounded-lg">
          <Star className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {numbers.map((item) => (
            <motion.div
              key={item.number}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-3 rounded-lg border transition-all cursor-pointer ${
                selectedNumbers.includes(item.number)
                  ? "bg-green-50 border-green-500 dark:bg-green-900/20"
                  : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300"
              }`}
              onClick={() => onToggleSelection(item.number)}
            >
              <div className="flex items-center justify-between mb-2">
                <Star
                  className={`w-4 h-4 ${
                    item.isFavorite
                      ? "text-cyan-500 fill-cyan-500"
                      : "text-gray-300"
                  }`}
                />
                {selectedNumbers.includes(item.number) && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              <p className="text-center font-mono text-sm text-gray-900 dark:text-white">
                {item.number}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
