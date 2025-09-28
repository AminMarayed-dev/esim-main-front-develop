import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, MapPin, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { step6Schema, type Step6FormData } from "@/types/registration";
import {
  getUserGeolocation,
  type GeolocationResponse,
} from "@/services/geolocation";
import { InternalPaymentGateway } from "./InternalPaymentGateway";
import { ExternalPaymentGateway } from "./ExternalPaymentGateway";

interface PaymentData {
  transactionId: string;
  paymentMethod: string;
  paymentType?: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  timestamp: string;
}

interface Step6PaymentGatewayProps {
  onSubmit: (data: Step6FormData) => void;
  onBack: () => void;
  totalAmount?: number;
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

const loadingVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export function Step6PaymentGateway({
  onSubmit,
  onBack,
  totalAmount,
}: Step6PaymentGatewayProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationData, setLocationData] = useState<GeolocationResponse | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<
    "internal" | "external" | null
  >(null);
  const [showManualSelection, setShowManualSelection] = useState(false);

  const form = useForm<Step6FormData>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      paymentMethod: "",
      paymentGateway: "internal",
      amount: totalAmount,
      currency: "IRR",
      paymentStatus: "pending",
    },
  });

  // Detect user location on component mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const geoData = await getUserGeolocation();

        if (geoData) {
          setLocationData(geoData);

          // Determine payment gateway based on country
          const isIranian = geoData.location.country_code2 === "IR";
          const gateway = isIranian ? "internal" : "external";

          setPaymentGateway(gateway);
          form.setValue("paymentGateway", gateway);
          form.setValue("currency", isIranian ? "IRR" : "USD");

          console.log(
            `Detected location: ${geoData.location.country_name} (${geoData.location.country_code2})`
          );
          console.log(`Payment gateway: ${gateway}`);
        } else {
          throw new Error("Unable to detect location");
        }
      } catch (error) {
        console.error("Location detection failed:", error);
        setLocationError("Unable to detect your location automatically");
        setShowManualSelection(true);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    detectLocation();
  }, [form]);

  const handlePaymentSuccess = (paymentData: PaymentData) => {
    const formData: Step6FormData = {
      paymentMethod: paymentData.paymentMethod,
      paymentGateway: paymentData.gateway as "internal" | "external",
      amount: paymentData.amount,
      currency: paymentData.currency,
      transactionId: paymentData.transactionId,
      paymentStatus: paymentData.status as "pending" | "completed" | "failed",
    };

    onSubmit(formData);
  };

  const handleManualGatewaySelection = (gateway: "internal" | "external") => {
    setPaymentGateway(gateway);
    form.setValue("paymentGateway", gateway);
    form.setValue("currency", gateway === "internal" ? "IRR" : "USD");
    setShowManualSelection(false);
  };

  // Loading state
  if (isLoadingLocation) {
    return (
      <motion.div
        key="payment-loading"
        variants={loadingVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Detecting Your Location
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            We're determining the best payment options for you...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>Analyzing IP geolocation</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Manual gateway selection state
  if (showManualSelection) {
    return (
      <motion.div
        key="manual-selection"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Select Payment Region
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            We couldn't automatically detect your location
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please choose your preferred payment gateway
          </p>
        </div>

        {locationError && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                {locationError}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Internal Gateway Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-50 to-green-50 dark:from-green-900/20 dark:to-green-900/20 rounded-2xl border border-green-200 dark:border-green-700 p-8 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => handleManualGatewaySelection("internal")}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Iran / Internal Gateway
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                ZarinPal, Sadad, Iranian Banks
              </p>
              <div className="text-sm text-green-700 dark:text-green-400">
                • Payments in Iranian Toman (IRR)
                <br />
                • Local banking system
                <br />• Persian language support
              </div>
            </div>
          </motion.div>

          {/* External Gateway Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 p-8 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => handleManualGatewaySelection("external")}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                International Gateway
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                PayPal, Visa, Crypto currencies
              </p>
              <div className="text-sm text-blue-700 dark:text-blue-400">
                • Payments in USD
                <br />
                • Global payment methods
                <br />• Cryptocurrency support
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="py-3 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Previous Step
          </Button>
        </div>
      </motion.div>
    );
  }

  // Main payment gateway view
  return (
    <motion.div
      key="payment-gateway"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      {/* Location Detection Result */}
      {locationData && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-900/20 dark:to-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Location Detected: {locationData.location.country_name}{" "}
                  {locationData.location.country_emoji}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {locationData.location.city},{" "}
                  {locationData.location.state_prov}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Payment Gateway:{" "}
                {paymentGateway === "internal"
                  ? "Internal (Iran)"
                  : "International"}
              </p>
              <button
                onClick={() => setShowManualSelection(true)}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                Change Gateway
              </button>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        {/* Render appropriate payment gateway */}
        {paymentGateway === "internal" ? (
          <InternalPaymentGateway
            amount={totalAmount}
            currency="IRR"
            onPaymentSuccess={handlePaymentSuccess}
            onBack={onBack}
          />
        ) : (
          <ExternalPaymentGateway
            amount={totalAmount}
            currency="USD"
            onPaymentSuccess={handlePaymentSuccess}
            onBack={onBack}
          />
        )}
      </Form>
    </motion.div>
  );
}
