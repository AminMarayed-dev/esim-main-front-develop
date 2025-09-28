import { motion } from "framer-motion";
import { Logo } from "./logo";
import { useTranslation } from "react-i18next";

export function Loading() {
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    }),
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const textArray = "eSIM dariyacell".split("");

  const { t } = useTranslation();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-red-50 to-black/5 relative overflow-hidden"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-200/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Animated Logo */}
        <motion.div
          variants={logoVariants}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-2xl">
              <Logo size="xl" />
            </div>
            {/* Pulsing ring effect */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.3, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 border-2 border-red-500 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0.1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="absolute inset-0 border border-red-300 rounded-full"
            />
            {/* Glow effect */}
            <motion.div
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-red-500/20 rounded-full blur-xl scale-150"
            />
          </div>
        </motion.div>

        {/* Animated Text */}
        <div className="flex justify-center items-center space-x-1" dir="ltr">
          {textArray.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              className={`text-4xl font-bold ${letter === " " ? "w-2" : ""} ${
                i < 4
                  ? "text-red-600"
                  : i === 4
                  ? "text-black/20 mx-2"
                  : "text-black"
              }`}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center items-center mt-8 space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-6 text-gray-600 text-lg font-medium"
        >
          {t("loading.title")}
        </motion.p>
      </div>
    </motion.div>
  );
}
