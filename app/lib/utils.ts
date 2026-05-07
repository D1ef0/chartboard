import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(Math.round(n * 100) / 100);
}

export const CHART_COLORS = [
  "oklch(0.72 0.16 60)",
  "oklch(0.55 0.18 25)",
  "oklch(0.55 0.16 305)",
  "oklch(0.55 0.14 220)",
  "oklch(0.50 0.12 165)",
  "oklch(0.42 0.05 270)",
];
