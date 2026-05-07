export interface UploadResponse {
  file_id: string;
  filename: string;
  rows: number;
  columns: string[];
  preview: Record<string, unknown>[];
  column_types: Record<string, string>;
}

export interface ChartParameters {
  x_axis: string;
  y_axis: string | null;
  aggregation: "sum" | "count" | "avg" | "none";
}

export interface ChartSuggestion {
  title: string;
  chart_type: "bar" | "line" | "pie" | "scatter";
  parameters: ChartParameters;
  insight: string;
}

export interface AnalysisResponse {
  suggestions: ChartSuggestion[];
  overall_summary: string;
  file_id: string;
}

export interface ChartDataResponse {
  data: Record<string, unknown>[];
  x_key: string;
  y_keys: string[];
  chart_type: string;
}

export interface DashboardChart {
  id: string;
  suggestion: ChartSuggestion;
  file_id: string;
}

export type AppState = "idle" | "uploading" | "analyzing" | "ready" | "error";
