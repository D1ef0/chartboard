import { useQuery } from "@tanstack/react-query";
import { getChartData } from "../../lib/api";
import type { DashboardChart } from "../../types";
import { BarChartComponent } from "./charts/BarChartComponent";
import { LineChartComponent } from "./charts/LineChartComponent";
import { PieChartComponent } from "./charts/PieChartComponent";
import { ScatterChartComponent } from "./charts/ScatterChartComponent";

interface ChartRendererProps {
  chart: DashboardChart;
}

export function ChartRenderer({ chart }: ChartRendererProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["chart-data", chart.id],
    queryFn: () =>
      getChartData(chart.file_id, chart.suggestion.chart_type, chart.suggestion.parameters),
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-400">
        <p className="text-sm">No se pudo cargar el gráfico</p>
        <button
          onClick={() => refetch()}
          className="text-xs text-blue-500 hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const props = { data: data.data, xKey: data.x_key, yKeys: data.y_keys };

  switch (chart.suggestion.chart_type) {
    case "bar": return <BarChartComponent {...props} />;
    case "line": return <LineChartComponent {...props} />;
    case "pie": return <PieChartComponent {...props} />;
    case "scatter": return <ScatterChartComponent {...props} />;
    default: return <BarChartComponent {...props} />;
  }
}
