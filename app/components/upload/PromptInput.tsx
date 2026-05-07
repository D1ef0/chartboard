import { useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Sparkles } from "lucide-react";

interface PromptInputProps {
  filename: string;
  rows: number;
  columns: number;
  onAnalyze: (prompt: string) => void;
}

const CHIPS = [
  "📈 Tendencias temporales",
  "🏆 Mejor rendimiento por categoría",
  "🔗 Correlaciones entre variables",
  "⚠️ Valores atípicos y anomalías",
  "🌍 Comparativa entre segmentos",
  "📊 Distribución general de los datos",
];

const MAX_CHARS = 500;

export function PromptInput({ filename, rows, columns, onAnalyze }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleChipClick = (text: string) => {
    setPrompt(text.slice(0, MAX_CHARS));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setPrompt(e.target.value);
    }
  };

  const isEmpty = prompt.trim().length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
    >
      {/* File info header */}
      <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
          <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
            &ldquo;{filename}&rdquo;
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              {rows.toLocaleString()} filas
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              {columns} columnas
            </span>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          ¿En qué quieres enfocarte?
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Cuéntale a la IA qué aspectos te interesan. Puedes dejarlo en blanco para un análisis general.
        </p>
      </div>

      {/* Chips */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Sugerencias:</p>
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((chip, index) => (
            <motion.button
              key={chip}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleChipClick(chip)}
              className="px-3 py-1.5 rounded-full text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
            >
              {chip}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative mb-5">
        <textarea
          value={prompt}
          onChange={handleChange}
          placeholder="Ej: Quiero ver las tendencias de ventas por región y detectar meses con caídas..."
          rows={5}
          className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <span className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-600 pointer-events-none">
          {prompt.length}/{MAX_CHARS}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => onAnalyze(prompt)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          {isEmpty ? (
            <>
              <Sparkles className="w-4 h-4" />
              Analizar (sin instrucción específica)
            </>
          ) : (
            <>
              Analizar con IA →
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => onAnalyze("")}
          className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors underline-offset-2 hover:underline"
        >
          Omitir, analizar sin instrucción
        </button>
      </div>
    </motion.div>
  );
}
