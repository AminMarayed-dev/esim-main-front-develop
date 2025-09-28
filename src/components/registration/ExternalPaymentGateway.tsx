import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Shield,
  Check,
  Smartphone,
  Clock,
  Star,
  DollarSign,
  Bitcoin,
  CheckCircle,
  Globe,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import {
  EXTERNAL_PAYMENT_METHODS,
  CRYPTOCURRENCY_METHODS,
} from "@/types/registration";

const externalPaymentSchema = z.object({
  paymentMethod: z.string().min(1, "Please select a payment method"),
  paymentType: z.enum(["traditional", "crypto"]),
  email: z.string().email("Please enter a valid email").optional(),
  billingAddress: z.string().optional(),
});

type ExternalPaymentFormData = z.infer<typeof externalPaymentSchema>;

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

interface ExternalPaymentGatewayProps {
  amount: number | undefined;
  currency: string;
  onPaymentSuccess: (paymentData: PaymentData) => void;
  onBack: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const paymentMethodVariants = {
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

// Payment method icons and colors
const traditionalPaymentIcons: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
  }
> = {
  PayPal: {
    icon: DollarSign,
    color: "bg-blue-600",
    description: "Secure worldwide payments",
  },
  "Visa Card": {
    icon: CreditCard,
    color: "bg-blue-800",
    description: "Visa credit/debit cards",
  },
  Mastercard: {
    icon: CreditCard,
    color: "bg-red-600",
    description: "Mastercard payments",
  },
  Skrill: {
    icon: Globe,
    color: "bg-purple-600",
    description: "Digital wallet service",
  },
  "Envato Market Credit": {
    icon: Star,
    color: "bg-green-600",
    description: "Envato credits",
  },
  "Apple Pay": {
    icon: Smartphone,
    color: "bg-gray-800",
    description: "Apple Pay wallet",
  },
  "Google Pay": {
    icon: Smartphone,
    color: "bg-green-500",
    description: "Google Pay wallet",
  },
};

const cryptoPaymentIcons: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    symbol: string;
    description: string;
  }
> = {
  "Bitcoin (BTC)": {
    icon: Bitcoin,
    color: "bg-orange-500",
    symbol: "BTC",
    description: "Leading cryptocurrency",
  },
  "Ethereum (ETH)": {
    icon: Coins,
    color: "bg-indigo-600",
    symbol: "ETH",
    description: "Smart contract platform",
  },
  "Tether (USDT)": {
    icon: Coins,
    color: "bg-green-600",
    symbol: "USDT",
    description: "Stable coin (USD pegged)",
  },
  "TRON (TRX)": {
    icon: Coins,
    color: "bg-red-500",
    symbol: "TRX",
    description: "Fast blockchain network",
  },
  "Binance Coin (BNB)": {
    icon: Coins,
    color: "bg-yellow-500",
    symbol: "BNB",
    description: "Binance ecosystem token",
  },
  "Cardano (ADA)": {
    icon: Coins,
    color: "bg-blue-500",
    symbol: "ADA",
    description: "Sustainable blockchain",
  },
  "Solana (SOL)": {
    icon: Coins,
    color: "bg-purple-500",
    symbol: "SOL",
    description: "High-performance blockchain",
  },
  "Dogecoin (DOGE)": {
    icon: Coins,
    color: "bg-yellow-600",
    symbol: "DOGE",
    description: "Community-driven coin",
  },
};

export function ExternalPaymentGateway({
  amount=22,
  currency,
  onPaymentSuccess,
  onBack,
}: ExternalPaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"traditional" | "crypto">(
    "traditional"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<ExternalPaymentFormData>({
    resolver: zodResolver(externalPaymentSchema),
    defaultValues: {
      paymentMethod: "",
      paymentType: "traditional",
      email: "",
      billingAddress: "",
    },
  });

  const formatAmount = (amount: number, currency: string) => {
    if (currency === "USD") {
      return `$${(amount / 50000).toFixed(2)}`; // Mock conversion rate
    }
    return `${new Intl.NumberFormat("en-US").format(amount)} ${currency}`;
  };

  const handlePayment = async (data: ExternalPaymentFormData) => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // Mock successful payment
    const paymentData = {
      transactionId: `EXT_${Date.now()}`,
      paymentMethod: data.paymentMethod,
      paymentType: data.paymentType,
      amount,
      currency: paymentType === "crypto" ? "USD" : currency,
      status: "completed",
      gateway: "external",
      timestamp: new Date().toISOString(),
    };

    setIsProcessing(false);
    onPaymentSuccess(paymentData);
  };

  const currentPaymentMethods =
    paymentType === "traditional"
      ? EXTERNAL_PAYMENT_METHODS
      : CRYPTOCURRENCY_METHODS;

  return (
    <motion.div
      key="external-payment"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <Globe className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          International Payment Gateway
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Choose your preferred payment method
        </p>
      </div>

      {/* Amount Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 p-6 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Total Amount
            </h3>
          </div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {formatAmount(amount, paymentType === "crypto" ? "USD" : currency)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Including all selected services
          </p>
        </div>
      </div>

      {/* Payment Type Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex gap-1">
          <button
            onClick={() => {
              setPaymentType("traditional");
              setSelectedMethod("");
              form.setValue("paymentType", "traditional");
              form.setValue("paymentMethod", "");
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              paymentType === "traditional"
                ? "bg-white dark:bg-gray-700 text-blue-600 shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Traditional Methods
            </div>
          </button>
          <button
            onClick={() => {
              setPaymentType("crypto");
              setSelectedMethod("");
              form.setValue("paymentType", "crypto");
              form.setValue("paymentMethod", "");
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              paymentType === "crypto"
                ? "bg-white dark:bg-gray-700 text-purple-600 shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Bitcoin className="w-5 h-5" />
              Cryptocurrency
            </div>
          </button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-8">
          {/* Payment Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentPaymentMethods.map((method, index) => {
              const methodInfo =
                paymentType === "traditional"
                  ? traditionalPaymentIcons[method]
                  : cryptoPaymentIcons[method];
              const Icon = methodInfo?.icon || CreditCard;

              return (
                <motion.div
                  key={method}
                  custom={index}
                  variants={paymentMethodVariants}
                  initial="hidden"
                  animate="visible"
                  className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                    selectedMethod === method
                      ? `border-${
                          paymentType === "traditional" ? "blue" : "purple"
                        }-500 bg-${
                          paymentType === "traditional" ? "blue" : "purple"
                        }-50 dark:bg-${
                          paymentType === "traditional" ? "blue" : "purple"
                        }-900/30 shadow-lg`
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 hover:shadow-md"
                  }`}
                  onClick={() => {
                    setSelectedMethod(method);
                    form.setValue("paymentMethod", method);
                  }}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div
                      className={`w-16 h-16 ${
                        methodInfo?.color || "bg-gray-500"
                      } rounded-full flex items-center justify-center`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {paymentType === "crypto" &&
                        methodInfo &&
                        "symbol" in methodInfo
                          ? (methodInfo as { symbol: string }).symbol
                          : method}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {methodInfo?.description || "Secure payment method"}
                      </p>
                    </div>

                    {/* Security Features */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      <span>Secure</span>
                      <Star className="w-3 h-3" />
                      <span>Trusted</span>
                    </div>

                    {/* Selection Indicator */}
                    {selectedMethod === method && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute top-3 right-3 w-6 h-6 bg-${
                          paymentType === "traditional" ? "blue" : "purple"
                        }-500 rounded-full flex items-center justify-center`}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Information Form */}
          {selectedMethod && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 dark:bg-gray-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Additional Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Email Address (Optional)
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="email"
                          placeholder="example@email.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Billing Address (Optional)
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          placeholder="Your billing address"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* Crypto Notice */}
          {paymentType === "crypto" && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-start gap-4">
                <Bitcoin className="w-8 h-8 text-yellow-600 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                    Cryptocurrency Payment Notice
                  </h4>
                  <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Transactions are processed on the blockchain
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Processing may take 5-30 minutes depending on network
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Make sure you have sufficient balance in your wallet
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-600 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">
                  Secure Payment Guarantee
                </h4>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    All transactions are secured with SSL encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Your payment information is never stored
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    24/7 customer support for payment issues
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-6 max-w-lg mx-auto pt-8 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 py-4 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={isProcessing}
            >
              Previous Step
            </Button>

            <Button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 py-4 px-8 text-lg font-semibold bg-gradient-to-r ${
                paymentType === "traditional"
                  ? "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  : "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              } text-white shadow-xl hover:shadow-2xl rounded-xl transition-all disabled:opacity-50`}
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  Pay{" "}
                  {formatAmount(
                    amount,
                    paymentType === "crypto" ? "USD" : currency
                  )}
                  {paymentType === "traditional" ? (
                    <CreditCard className="w-6 h-6" />
                  ) : (
                    <Bitcoin className="w-6 h-6" />
                  )}
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
