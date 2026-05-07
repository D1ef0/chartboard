import { useEffect, useMemo, useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAppStore } from "../../lib/store";
import { getChartData } from "../../lib/api";
import { MiniChart } from "./MiniChart";
import type { AnalysisResponse, ChartSuggestion } from "../../types";

interface SuggestionsGridProps {
  analysis: AnalysisResponse;
  onContinue?: () => void;
}

export function SuggestionsGrid({ analysis, onContinue }: SuggestionsGridProps) {
  const { addToDashboard, removeFromDashboard, isInDashboard, currentFile, dashboardCharts } = useAppStore();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return analysis.suggestions;
    return analysis.suggestions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.insight.toLowerCase().includes(q) ||
        s.chart_type.toLowerCase().includes(q)
    );
  }, [query, analysis.suggestions]);

  const previews = useQueries({
    queries: analysis.suggestions.map((s) => ({
      queryKey: ["preview", currentFile?.file_id, s.title],
      queryFn: () => getChartData(currentFile!.file_id, s.chart_type, s.parameters),
      enabled: !!currentFile,
      staleTime: Infinity,
    })),
  });

  const previewFor = (s: ChartSuggestion) => {
    const idx = analysis.suggestions.findIndex((x) => x.title === s.title);
    const r = previews[idx];
    if (!r?.data) return [];
    const yKey = r.data.y_keys?.[0];
    return r.data.data.map((row: any) => ({
      x: row[r.data.x_key],
      y: yKey ? Number(row[yKey]) || 0 : 0,
    }));
  };

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
      else if (e.key === "Enter" && filtered[cursor] && currentFile) {
        e.preventDefault();
        const s = filtered[cursor];
        if (isInDashboard(s.title)) return;
        addToDashboard(s, currentFile.file_id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor, filtered, currentFile, addToDashboard, isInDashboard]);

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 360px" }}>
      <div>
        <div className="cb-mono text-[11px] tracking-wider" style={{ color: "var(--color-ink-4)" }}>
          [03] · COMPOSE
        </div>
        <div className="flex items-baseline justify-between mt-1.5 mb-4">
          <h2 className="text-[32px] font-semibold tracking-tight m-0">
            {analysis.suggestions.length} views proposed.
          </h2>
          {onContinue && (
            <button
              onClick={onContinue}
              className="cb-mono text-[12px] px-3.5 py-2 rounded-md inline-flex items-center gap-2"
              style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)", color: "var(--color-ink-2)" }}
            >
              open dashboard <span className="cb-kbd">⌘D</span>
            </button>
          )}
        </div>

        {analysis.overall_summary && (
          <div
            className="rounded-lg px-4 py-3.5 mb-4 grid gap-3.5"
            style={{
              gridTemplateColumns: "auto 1fr",
              border: "1px solid var(--color-line)",
              background: "var(--color-bg-2)",
            }}
          >
            <div
              className="cb-mono text-[10px] self-start px-1.5 py-1 rounded"
              style={{ border: "1px solid var(--color-line)", color: "var(--color-ink-3)" }}
            >
              ANALYST
            </div>
            <div className="cb-mono text-[12.5px] leading-[1.7]" style={{ color: "var(--color-ink-2)" }}>
              {analysis.overall_summary}
            </div>
          </div>
        )}

        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg mb-2.5"
          style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)" }}
        >
          <span className="cb-mono" style={{ color: "var(--color-accent)" }}>›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
            placeholder="filter views… (try 'tend', 'bar', 'región')"
            className="flex-1 bg-transparent border-0 outline-0 cb-mono text-[13px]"
            style={{ color: "var(--color-ink)" }}
          />
          <span className="cb-mono text-[11px]" style={{ color: "var(--color-ink-4)" }}>
            ↑↓ <span className="cb-kbd">⏎</span> add
          </span>
        </div>

        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-line)", background: "var(--color-bg)" }}>
          {filtered.map((s, i) => {
            const added = isInDashboard(s.title);
            const active = i === cursor;
            return (
              <motion.div
                key={s.title}
                layout
                onMouseEnter={() => setCursor(i)}
                onClick={() => currentFile && !added && addToDashboard(s, currentFile.file_id)}
                className="grid items-center gap-3.5 px-4 py-3.5 cursor-pointer relative"
                style={{
                  gridTemplateColumns: "44px 1fr 140px 90px 110px",
                  borderTop: i === 0 ? 0 : "1px solid var(--color-line-soft)",
                  background: active ? "var(--color-bg-2)" : "transparent",
                }}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: "var(--color-accent)" }} />
                )}

                <div className="cb-mono text-[11px]" style={{ color: "var(--color-ink-4)" }}>
                  [{String(i + 1).padStart(2, "0")}]
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-[3px]">
                    <span
                      className="cb-mono text-[10px] px-1.5 py-[1px] rounded uppercase"
                      style={{ border: "1px solid var(--color-line)", color: "var(--color-ink-3)" }}
                    >
                      {s.chart_type}
                    </span>
                    <span className="font-semibold text-[14px] tracking-tight">{s.title}</span>
                  </div>
                  <div className="cb-mono text-[11.5px] leading-[1.5]" style={{ color: "var(--color-ink-3)" }}>
                    {s.insight}
                  </div>
                  <div className="flex gap-1.5 mt-1.5 cb-mono text-[10px]" style={{ color: "var(--color-ink-4)" }}>
                    <span>x: <span style={{ color: "var(--color-ink-3)" }}>{s.parameters.x_axis}</span></span>
                    <span>·</span>
                    <span>y: <span style={{ color: "var(--color-ink-3)" }}>{s.parameters.y_axis ?? "—"}</span></span>
                    <span>·</span>
                    <span>agg: <span style={{ color: "var(--color-ink-3)" }}>{s.parameters.aggregation}</span></span>
                  </div>
                </div>

                <div style={{ color: "var(--color-accent)" }}>
                  <MiniChart type={s.chart_type} data={previewFor(s)} color="currentColor" />
                </div>

                <div className="cb-mono text-[11px]">
                  <div className="mb-1" style={{ color: "var(--color-ink-4)" }}>conf [—]</div>
                  <div className="flex gap-[1.5px]">
                    {Array.from({ length: 10 }).map((_, k) => (
                      <div
                        key={k}
                        className="w-[6px] h-2 rounded-[1px]"
                        style={{
                          background: k < 8 ? "var(--color-accent)" : "var(--color-bg-3)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="justify-self-end">
                  {added ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromDashboard(dashboardCharts.find((c) => c.suggestion.title === s.title)!.id); }}
                      className="cb-mono text-[11px] px-2.5 py-[5px] rounded inline-flex items-center gap-1.5"
                      style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)", color: "var(--color-ok)" }}
                    >
                      ✓ pinned
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); currentFile && addToDashboard(s, currentFile.file_id); }}
                      className="cb-mono text-[11px] px-2.5 py-[5px] rounded"
                      style={{ background: "var(--color-ink)", color: "var(--color-bg)" }}
                    >
                      + pin
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-10 text-center cb-mono text-[12px]" style={{ color: "var(--color-ink-4)" }}>
              no views match "{query}"
            </div>
          )}
        </div>
      </div>

      {/* side rail */}
      <aside className="sticky top-20 h-fit">
        <div className="cb-mono text-[11px] tracking-wider mb-2" style={{ color: "var(--color-ink-4)" }}>
          PINNED · {dashboardCharts.length}
        </div>
        <div
          className="rounded-lg p-3 min-h-[220px]"
          style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)" }}
        >
          {dashboardCharts.length === 0 ? (
            <div className="cb-mono text-[12px] leading-[1.7] px-1 py-2" style={{ color: "var(--color-ink-4)" }}>
              press <span className="cb-kbd">⏎</span> on any view to pin it.<br />
              first pin becomes the <span style={{ color: "var(--color-accent)" }}>HERO</span>.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {dashboardCharts.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-md"
                  style={{ border: "1px solid var(--color-line-soft)", background: "var(--color-bg)" }}
                >
                  <span
                    className="cb-mono text-[10px]"
                    style={{ color: i === 0 ? "var(--color-accent)" : "var(--color-ink-4)" }}
                  >
                    {i === 0 ? "HERO" : `s${String(i + 1).padStart(2, "0")}`}
                  </span>
                  <span className="flex-1 text-[12px] truncate">{c.suggestion.title}</span>
                  <button
                    onClick={() => removeFromDashboard(c.id)}
                    className="cb-mono text-[12px]"
                    style={{ color: "var(--color-ink-4)" }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {onContinue && (
                <button
                  onClick={onContinue}
                  className="mt-1.5 px-3 py-2.5 rounded-md cb-mono text-[12px] font-semibold"
                  style={{ background: "var(--color-accent)", color: "oklch(0.18 0.05 60)" }}
                >
                  build dashboard →
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
