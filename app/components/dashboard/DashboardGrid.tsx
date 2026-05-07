import { X, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../lib/store";
import { ChartRenderer } from "./ChartRenderer";

export function DashboardGrid() {
  const { dashboardCharts, removeFromDashboard } = useAppStore();

  if (dashboardCharts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400 dark:text-gray-600">
        <BarChart2 className="w-12 h-12" />
        <p className="text-center text-sm max-w-xs">
          Agrega gráficos desde las sugerencias para construir tu dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AnimatePresence>
        {dashboardCharts.map((chart) => (
          <motion.div
            key={chart.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug pr-4">
                {chart.suggestion.title}
              </h3>
              <button
                onClick={() => removeFromDashboard(chart.id)}
                className="shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ChartRenderer chart={chart} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
