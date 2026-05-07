import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber, CHART_COLORS } from "../../../lib/utils";

interface ScatterChartComponentProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: string[];
}

export function ScatterChartComponent({ data, xKey, yKeys }: ScatterChartComponentProps) {
  const yKey = yKeys[0] ?? "y";
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ScatterChart margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(Number(v))} />
        <YAxis dataKey={yKey} type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(Number(v))} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill={CHART_COLORS[0]} opacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
