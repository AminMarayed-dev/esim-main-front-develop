import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Shield,
  Check,
  Building2,
  Clock,
  Star,
  Banknote,
  CheckCircle,
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
import { INTERNAL_PAYMENT_METHODS } from "@/types/registration";

const internalPaymentSchema = z.object({
  paymentMethod: z.string().min(1, "لطفاً روش پرداخت خود را انتخاب کنید"),
  email: z.string().email("ایمیل معتبر وارد کنید").optional(),
  phone: z.string().min(10, "شماره تلفن معتبر وارد کنید").optional(),
});

type InternalPaymentFormData = z.infer<typeof internalPaymentSchema>;

interface PaymentData {
  transactionId: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  timestamp: string;
}

interface InternalPaymentGatewayProps {
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
const paymentMethodIcons: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
  }
> = {
  ZarinPal: {
    icon: CreditCard,
    color: "bg-yellow-500",
    description: "درگاه معتبر و امن",
  },
  Sadad: {
    icon: Building2,
    color: "bg-blue-500",
    description: "بانک مرکزی ایران",
  },
  "Mellat Bank": {
    icon: Building2,
    color: "bg-red-500",
    description: "بانک ملت",
  },
  "Parsian Bank": {
    icon: Building2,
    color: "bg-green-500",
    description: "بانک پارسیان",
  },
  "Pasargad Bank": {
    icon: Building2,
    color: "bg-purple-500",
    description: "بانک پاسارگاد",
  },
  "Saman Bank": {
    icon: Building2,
    color: "bg-indigo-500",
    description: "بانک سامان",
  },
};

export function InternalPaymentGateway({
  amount=22,
  currency,
  onPaymentSuccess,
  onBack,
}: InternalPaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<InternalPaymentFormData>({
    resolver: zodResolver(internalPaymentSchema),
    defaultValues: {
      paymentMethod: "",
      email: "",
      phone: "",
    },
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };

  const handlePayment = async (data: InternalPaymentFormData) => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock successful payment
    const paymentData = {
      transactionId: `TXN_${Date.now()}`,
      paymentMethod: data.paymentMethod,
      amount,
      currency,
      status: "completed",
      gateway: "internal",
      timestamp: new Date().toISOString(),
    };

    setIsProcessing(false);
    onPaymentSuccess(paymentData);
  };

  return (
    <motion.div
      key="internal-payment"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4">
          <Banknote className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          پرداخت امن داخلی
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          انتخاب درگاه پرداخت مناسب شما
        </p>
      </div>

      {/* Amount Display */}
      <div className="bg-gradient-to-r from-green-50 to-green-50 dark:from-green-900/20 dark:to-green-900/20 rounded-2xl border border-green-200 dark:border-green-700 p-6 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              مبلغ قابل پرداخت
            </h3>
          </div>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            {formatAmount(amount)} تومان
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            شامل تمامی سرویس‌های انتخابی شما
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-8">
          {/* Payment Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTERNAL_PAYMENT_METHODS.map((method, index) => {
              const methodInfo = paymentMethodIcons[method];
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
                      ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-300 hover:shadow-md"
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
                        {method}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {methodInfo?.description || "درگاه پرداخت امن"}
                      </p>
                    </div>

                    {/* Security Features */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      <span>SSL امن</span>
                      <Star className="w-3 h-3" />
                      <span>تضمینی</span>
                    </div>

                    {/* Selection Indicator */}
                    {selectedMethod === method && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
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
                اطلاعات تکمیلی
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        ایمیل (اختیاری)
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="email"
                          placeholder="example@email.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        شماره تلفن (اختیاری)
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="tel"
                          placeholder="09123456789"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all direction-ltr"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-600 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">
                  امنیت پرداخت تضمین شده
                </h4>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    تمامی تراکنش‌ها با رمزنگاری SSL انجام می‌شود
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    اطلاعات بانکی شما ذخیره نمی‌شود
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    پشتیبانی ۲۴ ساعته برای مشکلات پرداخت
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
              مرحله قبل
            </Button>

            <Button
              type="submit"
              disabled={!selectedMethod || isProcessing}
              className="flex-1 py-4 px-8 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 animate-spin" />
                  در حال پردازش...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  پرداخت {formatAmount(amount)} تومان
                  <CreditCard className="w-6 h-6" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
