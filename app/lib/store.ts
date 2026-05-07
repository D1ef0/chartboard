import { create } from "zustand";
import type { UploadResponse, AnalysisResponse, DashboardChart, ChartSuggestion, AppState } from "../types";

interface AppStore {
  state: AppState;
  currentFile: UploadResponse | null;
  analysis: AnalysisResponse | null;
  dashboardCharts: DashboardChart[];
  errorMessage: string | null;

  setState: (state: AppState) => void;
  setFile: (file: UploadResponse) => void;
  setAnalysis: (analysis: AnalysisResponse) => void;
  setError: (message: string) => void;
  addToDashboard: (suggestion: ChartSuggestion, fileId: string) => void;
  removeFromDashboard: (id: string) => void;
  isInDashboard: (title: string) => boolean;
  reset: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  state: "idle",
  currentFile: null,
  analysis: null,
  dashboardCharts: [],
  errorMessage: null,

  setState: (state) => set({ state }),
  setFile: (file) => set({ currentFile: file }),
  setAnalysis: (analysis) => set({ analysis }),
  setError: (message) => set({ state: "error", errorMessage: message }),

  addToDashboard: (suggestion, fileId) => {
    const id = `${suggestion.title}-${Date.now()}`;
    set((s) => ({
      dashboardCharts: [...s.dashboardCharts, { id, suggestion, file_id: fileId }],
    }));
  },

  removeFromDashboard: (id) =>
    set((s) => ({
      dashboardCharts: s.dashboardCharts.filter((c) => c.id !== id),
    })),

  isInDashboard: (title) =>
    get().dashboardCharts.some((c) => c.suggestion.title === title),

  reset: () =>
    set({
      state: "idle",
      currentFile: null,
      analysis: null,
      dashboardCharts: [],
      errorMessage: null,
    }),
}));
