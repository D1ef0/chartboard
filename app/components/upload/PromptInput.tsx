import { useEffect, useRef, useState } from "react";

interface PromptInputProps {
  filename: string;
  rows: number;
  columns: number;
  columnNames: string[];
  columnTypes?: Record<string, string>;
  onAnalyze: (prompt: string) => void;
  onBack?: () => void;
}

const PRESETS = [
  { k: "T", label: "tendencias temporales", body: "Identifica tendencias temporales y estacionalidades. Marca puntos de inflexión." },
  { k: "R", label: "ranking por categoría", body: "Top y bottom performers por categoría. Concentración del top 5." },
  { k: "C", label: "correlaciones", body: "Correlaciones entre variables numéricas. Reporta r y p-value cuando aplique." },
  { k: "A", label: "anomalías / outliers", body: "Detecta outliers (> 3σ) y registros incoherentes." },
  { k: "S", label: "comparativa por segmento", body: "Comparativa entre segmentos: medias, medianas, varianza." },
  { k: "D", label: "distribución general", body: "Histograma y resumen de distribución para cada variable numérica." },
];

const TYPE_COLOR: Record<string, string> = {
  date: "var(--color-c4)",
  datetime: "var(--color-c4)",
  int: "var(--color-c1)",
  integer: "var(--color-c1)",
  float: "var(--color-c5)",
  number: "var(--color-c5)",
  str: "var(--color-ink-3)",
  string: "var(--color-ink-3)",
  bool: "var(--color-c3)",
};

export function PromptInput({ filename, rows, columns, columnNames, columnTypes, onAnalyze, onBack }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { taRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      const preset = PRESETS.find((p) => p.k === e.key.toUpperCase());
      if (preset) setPrompt(preset.body);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onAnalyze(prompt);
  };

  return (
    <div className="max-w-[920px] mx-auto px-5 py-8">
      <div
        className="flex items-center gap-3.5 px-4 py-3 rounded-lg cb-mono text-[12px]"
        style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)" }}
      >
        {onBack && (
          <button onClick={onBack} className="cb-mono text-[12px]" style={{ color: "var(--color-ink-3)" }}>
            ← back
          </button>
        )}
        <span style={{ color: "var(--color-ink-4)" }}>file:</span>
        <span style={{ color: "var(--color-ink)" }}>{filename}</span>
        <span style={{ color: "var(--color-ink-4)" }}>·</span>
        <span style={{ color: "var(--color-ink-2)" }}>{rows.toLocaleString()} rows</span>
        <span style={{ color: "var(--color-ink-4)" }}>·</span>
        <span style={{ color: "var(--color-ink-2)" }}>{columns} cols</span>
        <span className="ml-auto inline-flex items-center gap-1.5" style={{ color: "var(--color-ok)" }}>
          ✓ parsed
        </span>
      </div>

      <div
        className="mt-3.5 px-3.5 py-2.5 rounded-lg"
        style={{ border: "1px solid var(--color-line-soft)", background: "var(--color-bg)" }}
      >
        <div className="flex justify-between cb-mono text-[11px] mb-2" style={{ color: "var(--color-ink-4)" }}>
          <span>SCHEMA · {columns} columns</span>
          <span>preview · 5 rows</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {columnNames.map((c) => {
            const t = (columnTypes?.[c] || "str").toLowerCase();
            return (
              <span
                key={c}
                className="cb-mono text-[11px] px-2 py-[3px] rounded inline-flex items-center gap-1.5"
                style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)", color: "var(--color-ink-2)" }}
              >
                <span style={{ color: TYPE_COLOR[t] || "var(--color-ink-3)" }}>{t}</span>
                <span>{c}</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        <div className="cb-mono text-[11px] tracking-wider" style={{ color: "var(--color-ink-4)" }}>
          [02] · INSTRUCT
        </div>
        <h2 className="text-[32px] font-semibold tracking-tight my-1.5 mb-4">
          What should the analyst look for?
        </h2>
      </div>

      <div className="grid gap-2 mb-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {PRESETS.map((p) => (
          <button
            key={p.k}
            type="button"
            onClick={() => setPrompt(p.body)}
            className="text-left flex items-center gap-2.5 px-3 py-2.5 rounded-md cb-mono text-[12px]"
            style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)", color: "var(--color-ink-2)" }}
          >
            <span className="cb-kbd min-w-[22px] text-center">{p.k}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      <div className="rounded-lg px-3.5 py-2.5"
           style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)" }}>
        <div className="flex items-center gap-2 cb-mono text-[11px] mb-1.5" style={{ color: "var(--color-ink-4)" }}>
          <span style={{ color: "var(--color-accent)" }}>›</span>
          <span>prompt.txt</span>
          <span className="ml-auto">{prompt.length}/500</span>
        </div>
        <textarea
          ref={taRef}
          value={prompt}
          onChange={(e) => e.target.value.length <= 500 && setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          rows={5}
          placeholder="ej: quiero ver tendencias de ventas por región y detectar meses con caída inesperada."
          className="w-full bg-transparent border-0 outline-0 resize-none cb-mono text-[14px] leading-[1.6]"
          style={{ color: "var(--color-ink)" }}
        />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => onAnalyze(prompt)}
          className="cb-mono text-[13px] font-semibold px-4 py-2.5 rounded-md inline-flex items-center gap-2.5"
          style={{ background: "var(--color-accent)", color: "oklch(0.18 0.05 60)" }}
        >
          run analysis{" "}
          <span className="cb-kbd" style={{ background: "rgba(0,0,0,0.15)", borderColor: "rgba(0,0,0,0.2)", color: "inherit" }}>⌘⏎</span>
        </button>
        <button
          type="button"
          onClick={() => onAnalyze("")}
          className="cb-mono text-[12px] px-3.5 py-2 rounded-md"
          style={{ border: "1px solid var(--color-line)", color: "var(--color-ink-2)" }}
        >
          skip · auto-analyze
        </button>
        <span className="ml-auto cb-mono text-[11px]" style={{ color: "var(--color-ink-4)" }}>
          analyst: <span style={{ color: "var(--color-ink-2)" }}>haiku-4.5</span> · est. 6–9s
        </span>
      </div>
    </div>
  );
}
