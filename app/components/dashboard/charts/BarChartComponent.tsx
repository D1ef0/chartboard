import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber, CHART_COLORS } from "../../../lib/utils";

interface BarChartComponentProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: string[];
}

export function BarChartComponent({ data, xKey, yKeys }: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => String(v).length > 10 ? String(v).slice(0, 10) + "…" : String(v)}
        />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(Number(v))} />
        <Tooltip formatter={(v) => formatNumber(Number(v))} />
        {yKeys.map((key, i) => (
          <Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
