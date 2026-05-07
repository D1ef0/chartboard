import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface PromptInputProps {
  filename: string;
  rows: number;
  columns: number;
  columnNames: string[];
  columnTypes?: Record<string, string>;
  onAnalyze: (prompt: string) => void;
  onBack?: () => void;
}

interface Preset {
  k: string;
  label: string;
  body: string;
}

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
  const { t } = useTranslation();
  const presets = t("prompt.presets", { returnObjects: true }) as Preset[];
  const [prompt, setPrompt] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { taRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      const preset = presets.find((p) => p.k === e.key.toUpperCase());
      if (preset) setPrompt(preset.body);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [presets]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onAnalyze(prompt);
  };

  return (
    <div className="max-w-[920px] mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <div
        className="flex items-center flex-wrap gap-x-3.5 gap-y-1.5 px-4 py-3 rounded-lg cb-mono text-[12px]"
        style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)" }}
      >
        {onBack && (
          <button onClick={onBack} className="cb-mono text-[12px]" style={{ color: "var(--color-ink-3)" }}>
            {t("prompt.back")}
          </button>
        )}
        <span style={{ color: "var(--color-ink-4)" }}>{t("prompt.fileLabel")}</span>
        <span className="truncate max-w-[130px] sm:max-w-none" style={{ color: "var(--color-ink)" }}>{filename}</span>
        <span style={{ color: "var(--color-ink-4)" }}>·</span>
        <span style={{ color: "var(--color-ink-2)" }}>{t("prompt.rowsLabel", { count: rows.toLocaleString() })}</span>
        <span style={{ color: "var(--color-ink-4)" }}>·</span>
        <span style={{ color: "var(--color-ink-2)" }}>{t("prompt.colsLabel", { count: columns })}</span>
        <span className="ml-auto inline-flex items-center gap-1.5" style={{ color: "var(--color-ok)" }}>
          {t("prompt.parsed")}
        </span>
      </div>

      <div
        className="mt-3.5 px-3.5 py-2.5 rounded-lg"
        style={{ border: "1px solid var(--color-line-soft)", background: "var(--color-bg)" }}
      >
        <div className="flex justify-between cb-mono text-[11px] mb-2" style={{ color: "var(--color-ink-4)" }}>
          <span>{t("prompt.schemaLabel", { count: columns })}</span>
          <span>{t("prompt.previewLabel")}</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {columnNames.map((c) => {
            const type = (columnTypes?.[c] || "str").toLowerCase();
            return (
              <span
                key={c}
                className="cb-mono text-[11px] px-2 py-[3px] rounded inline-flex items-center gap-1.5"
                style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)", color: "var(--color-ink-2)" }}
              >
                <span style={{ color: TYPE_COLOR[type] || "var(--color-ink-3)" }}>{type}</span>
                <span>{c}</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        <div className="cb-mono text-[11px] tracking-wider" style={{ color: "var(--color-ink-4)" }}>
          {t("prompt.section")}
        </div>
        <h2 className="text-[22px] sm:text-[32px] font-semibold tracking-tight my-1.5 mb-4">
          {t("prompt.heading")}
        </h2>
      </div>

      <div className="grid gap-2 mb-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {presets.map((p) => (
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
          <span>{t("prompt.promptFile")}</span>
          <span className="ml-auto">{t("prompt.charCount", { current: prompt.length })}</span>
        </div>
        <textarea
          ref={taRef}
          value={prompt}
          onChange={(e) => e.target.value.length <= 500 && setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          rows={5}
          placeholder={t("prompt.placeholder")}
          className="w-full bg-transparent border-0 outline-0 resize-none cb-mono text-[14px] leading-[1.6]"
          style={{ color: "var(--color-ink)" }}
        />
      </div>

      <div className="flex items-center flex-wrap gap-3 mt-4">
        <button
          type="button"
          onClick={() => onAnalyze(prompt)}
          className="cb-mono text-[13px] font-semibold px-4 py-2.5 rounded-md inline-flex items-center gap-2.5"
          style={{ background: "var(--color-accent)", color: "oklch(0.18 0.05 60)" }}
        >
          {t("prompt.runButton")}{" "}
          <span className="cb-kbd" style={{ background: "rgba(0,0,0,0.15)", borderColor: "rgba(0,0,0,0.2)", color: "inherit" }}>⌘⏎</span>
        </button>
        <button
          type="button"
          onClick={() => onAnalyze("")}
          className="cb-mono text-[12px] px-3.5 py-2 rounded-md"
          style={{ border: "1px solid var(--color-line)", color: "var(--color-ink-2)" }}
        >
          {t("prompt.skipButton")}
        </button>
        <span className="ml-auto hidden sm:inline cb-mono text-[11px]" style={{ color: "var(--color-ink-4)" }}>
          {t("prompt.analystHint")}
        </span>
      </div>
    </div>
  );
}
