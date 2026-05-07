import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES_UPLOAD = [
  "Leyendo tu archivo...",
  "Procesando datos...",
  "Preparando análisis...",
];

const MESSAGES_ANALYZE = [
  "Consultando al analista IA...",
  "Detectando patrones...",
  "Identificando insights...",
  "Evaluando visualizaciones...",
  "Casi listo...",
];

interface LoadingStateProps {
  phase: "uploading" | "analyzing";
}

export function LoadingState({ phase }: LoadingStateProps) {
  const messages = phase === "uploading" ? MESSAGES_UPLOAD : MESSAGES_ANALYZE;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-3 rounded-full bg-gray-200 dark:bg-gray-700"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500 dark:text-gray-400 text-center font-medium"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
