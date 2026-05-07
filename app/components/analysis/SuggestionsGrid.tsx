import { motion } from "framer-motion";
import { SuggestionCard } from "./SuggestionCard";
import type { AnalysisResponse, ChartSuggestion } from "../../types";
import { useAppStore } from "../../lib/store";

interface SuggestionsGridProps {
  analysis: AnalysisResponse;
}

export function SuggestionsGrid({ analysis }: SuggestionsGridProps) {
  const { addToDashboard, isInDashboard, currentFile } = useAppStore();

  const handleAdd = (suggestion: ChartSuggestion) => {
    if (currentFile) {
      addToDashboard(suggestion, currentFile.file_id);
    }
  };

  return (
    <div className="space-y-6">
      {analysis.overall_summary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            {analysis.overall_summary}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {analysis.suggestions.map((suggestion, i) => (
          <motion.div
            key={suggestion.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <SuggestionCard
              suggestion={suggestion}
              isAdded={isInDashboard(suggestion.title)}
              onAdd={() => handleAdd(suggestion)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
