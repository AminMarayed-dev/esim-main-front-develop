import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { step1Schema, type Step1FormData } from "@/types/registration";

interface Step1PersonalInfoProps {
  onSubmit: (data: Step1FormData) => void;
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

export function Step1PersonalInfo({ onSubmit }: Step1PersonalInfoProps) {
  const { t } = useTranslation();
  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nationalId: "",
      email: "",
    },
  });

  return (
    <motion.div
      key="step1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        {t("step1.title")}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("step1.firstName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("step1.firstNamePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("step1.lastName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("step1.lastNamePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nationalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("step1.nationalId")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("step1.nationalIdPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("step1.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("step1.emailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
            size="lg"
          >
            {t("common.next")}
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
