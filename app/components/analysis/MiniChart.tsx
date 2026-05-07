import type { ChartSuggestion } from "../../types";

interface MiniChartProps {
  type: ChartSuggestion["chart_type"];
  data: { x: number | string; y: number }[];
  color?: string;
}

const PALETTE = [
  "var(--color-c1)", "var(--color-c2)", "var(--color-c3)",
  "var(--color-c4)", "var(--color-c5)", "var(--color-c6)",
];

export function MiniChart({ type, data, color = "var(--color-accent)" }: MiniChartProps) {
  const w = 120, h = 28;
  if (!data.length) return <svg width={w} height={h} />;

  if (type === "line" || type === "scatter") {
    const max = Math.max(...data.map((d) => d.y));
    const min = Math.min(...data.map((d) => d.y));
    const range = max - min || 1;
    if (type === "scatter") {
      const maxX = Math.max(...data.map((d) => Number(d.x))) || 1;
      return (
        <svg width={w} height={h}>
          {data.slice(0, 30).map((d, i) => (
            <circle
              key={i}
              cx={(Number(d.x) / maxX) * (w - 2) + 1}
              cy={h - ((d.y - min) / range) * (h - 2) - 1}
              r={1.4}
              fill={color}
              opacity={0.7}
            />
          ))}
        </svg>
      );
    }
    const stepX = w / (data.length - 1 || 1);
    const path = data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${h - ((d.y - min) / range) * (h - 4) - 2}`)
      .join(" ");
    return (
      <svg width={w} height={h}>
        <path d={path} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "bar") {
    const max = Math.max(...data.map((d) => d.y)) || 1;
    const bw = w / data.length;
    return (
      <svg width={w} height={h}>
        {data.map((d, i) => {
          const bh = (d.y / max) * (h - 2);
          return (
            <rect key={i} x={i * bw + 0.5} y={h - bh} width={bw - 1.5} height={bh} fill={color} opacity={0.85} />
          );
        })}
      </svg>
    );
  }

  // pie
  const total = data.reduce((s, d) => s + d.y, 0) || 1;
  let acc = 0;
  const cx = h / 2, cy = h / 2, r = h / 2 - 1;
  return (
    <svg width={h} height={h}>
      {data.map((d, i) => {
        const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2;
        acc += d.y;
        const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
            fill={PALETTE[i % PALETTE.length]}
          />
        );
      })}
    </svg>
  );
}
