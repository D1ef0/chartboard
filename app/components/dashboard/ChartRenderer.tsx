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
      <div className="h-full flex items-center justify-center">
        <div className="flex gap-[2px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="w-[4px] rounded-[1px]"
              style={{
                height: 20,
                background: "var(--color-line)",
                animation: `cb-pulse 1.2s ease-in-out ${i * 0.05}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2">
        <p className="cb-mono text-[11px]" style={{ color: "var(--color-danger)" }}>error loading chart</p>
        <button
          onClick={() => refetch()}
          className="cb-mono text-[11px]"
          style={{ color: "var(--color-accent)" }}
        >
          retry ↺
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
