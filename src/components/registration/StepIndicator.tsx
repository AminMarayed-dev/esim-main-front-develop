import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StepIndicatorProps {
  currentStep: number;
}

const stepIndicatorVariants = {
  inactive: { scale: 1, backgroundColor: "rgb(148 163 184)" },
  active: { scale: 1.1, backgroundColor: "rgb(220 38 38)" },
  completed: { scale: 1, backgroundColor: "rgb(220 38 38)" },
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center mb-6 md:mb-8">
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 rtl:space-x-reverse">
        <motion.div
          variants={stepIndicatorVariants}
          animate={
            currentStep >= 1
              ? currentStep > 1
                ? "completed"
                : "active"
              : "inactive"
          }
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        >
          {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : t("step.1")}
        </motion.div>
        <div className="w-8 sm:w-10 md:w-12 h-0.5 bg-gray-300 dark:bg-gray-600" />
        <motion.div
          variants={stepIndicatorVariants}
          animate={
            currentStep >= 2
              ? currentStep > 2
                ? "completed"
                : "active"
              : "inactive"
          }
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        >
          {currentStep > 2 ? <CheckCircle className="w-6 h-6" /> : t("step.2")}
        </motion.div>
        <div className="w-8 sm:w-10 md:w-12 h-0.5 bg-gray-300 dark:bg-gray-600" />
        <motion.div
          variants={stepIndicatorVariants}
          animate={
            currentStep >= 3
              ? currentStep > 3
                ? "completed"
                : "active"
              : "inactive"
          }
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        >
          {currentStep > 3 ? <CheckCircle className="w-6 h-6" /> : t("step.3")}
        </motion.div>
        <div className="w-8 sm:w-10 md:w-12 h-0.5 bg-gray-300 dark:bg-gray-600" />
        <motion.div
          variants={stepIndicatorVariants}
          animate={
            currentStep >= 4
              ? currentStep > 4
                ? "completed"
                : "active"
              : "inactive"
          }
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        >
          {currentStep > 4 ? <CheckCircle className="w-6 h-6" /> : t("step.4")}
        </motion.div>
        <div className="w-8 sm:w-10 md:w-12 h-0.5 bg-gray-300 dark:bg-gray-600" />
        <motion.div
          variants={stepIndicatorVariants}
          animate={
            currentStep >= 5
              ? currentStep > 5
                ? "completed"
                : "active"
              : "inactive"
          }
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        >
          {currentStep > 5 ? <CheckCircle className="w-6 h-6" /> : t("step.5")}
        </motion.div>
        <div className="w-8 sm:w-10 md:w-12 h-0.5 bg-gray-300 dark:bg-gray-600" />
        <motion.div
          variants={stepIndicatorVariants}
          animate={currentStep >= 6 ? "active" : "inactive"}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        >
          {t("step.6")}
        </motion.div>
      </div>
    </div>
  );
}
