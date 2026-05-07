import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { CHART_COLORS } from "../../../lib/utils";

interface PieChartComponentProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: string[];
}

function renderLabel(props: PieLabelRenderProps): string {
  const name = String(props.name ?? "").slice(0, 12);
  const pct = ((props.percent ?? 0) * 100).toFixed(0);
  return `${name} ${pct}%`;
}

export function PieChartComponent({ data, xKey, yKeys }: PieChartComponentProps) {
  const yKey = yKeys[0] ?? "value";
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey={yKey}
          nameKey={xKey}
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={renderLabel}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
