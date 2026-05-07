import { BarChart3, LineChart, PieChart, ScatterChart, PlusCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ChartSuggestion } from "../../types";
import { cn } from "../../lib/utils";

const CHART_ICONS = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  scatter: ScatterChart,
};

const CHART_LABELS = {
  bar: "Barras",
  line: "Líneas",
  pie: "Pastel",
  scatter: "Dispersión",
};

interface SuggestionCardProps {
  suggestion: ChartSuggestion;
  isAdded: boolean;
  onAdd: () => void;
}

export function SuggestionCard({ suggestion, isAdded, onAdd }: SuggestionCardProps) {
  const Icon = CHART_ICONS[suggestion.chart_type] ?? BarChart3;
  const label = CHART_LABELS[suggestion.chart_type] ?? suggestion.chart_type;

  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border p-5 flex flex-col gap-4 transition-shadow hover:shadow-md",
        "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 shrink-0">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">
              {suggestion.title}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
              {label}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
        {suggestion.insight}
      </p>

      <button
        onClick={onAdd}
        disabled={isAdded}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg text-sm font-medium transition-all",
          isAdded
            ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 cursor-default"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        )}
      >
        {isAdded ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Agregado
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4" />
            Agregar al Dashboard
          </>
        )}
      </button>
    </motion.div>
  );
}
