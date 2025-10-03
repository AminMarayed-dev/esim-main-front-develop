import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Logo } from "./ui/logo";
import { LanguageSelector } from "./ui/language-selector";
import { LanguageStatus } from "./ui/language-status";
import {
  type Step1FormData,
  type Step2FormData,
  type Step3FormData,
  type Step4FormData,
  type Step5FormData,
  type Step6FormData,
} from "@/types/registration";
import { availableNumbers } from "@/data/phoneNumbers";
import { StepIndicator } from "./registration/StepIndicator";
import { Step1PersonalInfo } from "./registration/Step1PersonalInfo";
import { Step2IdCardUpload } from "./registration/Step2IdCardUpload";
import { Step3PhoneSelection } from "./registration/Step3PhoneSelection";
import { Step4ServiceSelection } from "./registration/Step4ServiceSelection";
import { Step5OperatorSelection } from "./registration/Step5OperatorSelection";
import { Step6PaymentGateway } from "./registration/Step6PaymentGateway";
import { RegistrationSuccess } from "./registration/RegistrationSuccess";
import { sendActivationEmailAndQr } from "@/services/activation";

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

export function UserRegistrationForm() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);
  // const [step2Data, setStep2Data] = useState<Step2FormData | null>(null);
  const [step3Data, setStep3Data] = useState<Step3FormData | null>(null);
  const [step4Data, setStep4Data] = useState<Step4FormData | null>(null);
  const [step5Data, setStep5Data] = useState<Step5FormData | null>(null);


  const [sendingActivation, setSendingActivation] = useState(false);

  const onStep1Submit = (data: Step1FormData) => {
    setStep1Data(data);
    setCurrentStep(2);
    toast.success(
      t("step1.personalInfoSuccess", "Personal information saved successfully!")
    );
  };

  const onStep2Submit = (data: Step2FormData) => {
    void data;
    // setStep2Data(data);
    setCurrentStep(3);
    toast.success(t("step2.uploadSuccess"));
  };

  const onStep3Submit = (data: Step3FormData) => {
    setStep3Data(data);
    setCurrentStep(4);
    toast.success(t("step3.numbersSuccess"));
  };

  const onStep4Submit = (data: Step4FormData) => {
    setStep4Data(data);
    setCurrentStep(5);
    toast.success(t("step4.servicesSuccess"));
  };

  const onStep5Submit = (data: Step5FormData) => {
    setStep5Data(data);
    setCurrentStep(6);
    toast.success(t("step5.operatorsSuccess"));
  };

 const onStep6Submit = async (data: Step6FormData) => {
  void data;
   const email = step1Data?.email?.trim();
   const country = step5Data?.country?.trim();

   if (!email) {
     toast.error("Email is missing from Step 1.");
     return;
   }
   if (!country) {
     toast.error("Country is missing from Step 5.");
     return;
   }

   setSendingActivation(true);
   try {
     await toast.promise(sendActivationEmailAndQr({ email, country }), {
       loading: "Finalizing your registration…",
       success: "Activation email with your eSIM QR has been sent!",
       error: "Could not finalize registration. Please try again.",
     });

     // All good → move to success
     setCurrentStep(7);
   } finally {
     setSendingActivation(false);
   }
 };

  const onNewRegistration = () => {
    setCurrentStep(1);
    setStep1Data(null);
    // setStep2Data(null);
    setStep3Data(null);
    setStep4Data(null);
    setStep5Data(null);
    toast.info(t("app.newRegistration"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-red-50 to-black/5 dark:from-gray-900 dark:via-red-900/20 dark:to-black/40 px-4 py-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`w-full ${
          currentStep === 2
            ? "max-w-5xl"
            : currentStep === 3
            ? "max-w-6xl"
            : currentStep === 4
            ? "max-w-3xl"
            : currentStep === 5
            ? "max-w-5xl"
            : currentStep === 6
            ? "max-w-6xl"
            : currentStep === 7
            ? "max-w-3xl"
            : "max-w-lg"
        }`}
      >
        {/* Header - Only show for steps 1-6 */}
        {currentStep <= 6 && (
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <Logo size="xl" />
            </div>
            <div className="flex justify-center mb-4">
              <LanguageSelector />
            </div>
            <LanguageStatus />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("app.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("app.subtitle")}
            </p>
          </div>
        )}

        {/* Step Indicator - Only show for steps 1-6 */}
        {currentStep <= 6 && <StepIndicator currentStep={currentStep} />}

        {/* Form Container */}
        <motion.div
          className={`${
            currentStep === 7
              ? "bg-transparent"
              : "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700"
          } ${
            currentStep === 3 || currentStep === 5 || currentStep === 6
              ? "p-4 md:p-6 lg:p-8"
              : "p-6 md:p-8"
          }`}
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1PersonalInfo onSubmit={onStep1Submit} />
            )}

            {currentStep === 2 && step1Data && (
              <Step2IdCardUpload
                onSubmit={onStep2Submit}
                onBack={() => setCurrentStep(1)}
                userInfo={step1Data}
              />
            )}

            {currentStep === 3 && (
              <Step3PhoneSelection
                onSubmit={onStep3Submit}
                onBack={() => setCurrentStep(2)}
                availableNumbers={availableNumbers}
              />
            )}

            {currentStep === 4 && (
              <Step4ServiceSelection
                onSubmit={onStep4Submit}
                onBack={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 5 && step4Data && (
              <Step5OperatorSelection
                onSubmit={onStep5Submit}
                onBack={() => setCurrentStep(4)}
                step4Data={step4Data}
              />
            )}

            {currentStep === 6 && step5Data && step4Data && (
              <Step6PaymentGateway
                onSubmit={onStep6Submit}
                onBack={() => setCurrentStep(5)}
              />
            )}

            {currentStep === 7 && step1Data && step3Data && (
              <RegistrationSuccess
                firstName={step1Data.firstName}
                lastName={step1Data.lastName}
                selectedNumbers={step3Data.selectedNumbers}
                onNewRegistration={onNewRegistration}
                email={step1Data.email} // ← pass email to show in UI
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
