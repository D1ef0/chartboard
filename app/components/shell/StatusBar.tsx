import { useTheme } from "../../lib/theme";
import type { UploadResponse, AppState } from "../../types";

interface StatusBarProps {
  file: UploadResponse | null;
  state: AppState;
  onReset: () => void;
}

const STATE_LABEL: Record<AppState, string> = {
  idle: "IDLE",
  uploading: "UPLOADING",
  prompting: "PROMPTING",
  analyzing: "ANALYZING",
  ready: "READY",
  error: "ERROR",
};

export function StatusBar({ file, state, onReset }: StatusBarProps) {
  const { theme, toggle } = useTheme();

  return (
    <div
      className="sticky top-0 z-20 border-b backdrop-blur"
      style={{ borderColor: "var(--color-line)", background: "color-mix(in oklch, var(--color-bg-2), transparent 10%)" }}
    >
      <div className="max-w-[1400px] mx-auto px-3 sm:px-5 py-2 flex items-center gap-3 sm:gap-4 flex-wrap text-[11px] cb-mono"
           style={{ color: "var(--color-ink-2)" }}>
        {/* logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-2"
          style={{ color: "var(--color-ink)", background: "none", border: "none", padding: 0 }}
        >
          <div className="w-[18px] h-[18px] rounded grid place-items-center"
               style={{ background: "var(--color-ink)" }}>
            <span className="text-[11px] font-bold" style={{ color: "var(--color-bg)" }}>▦</span>
          </div>
          <span className="font-sans font-semibold text-[13px] tracking-tight">chartboard</span>
          <span className="hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>v0.4.1</span>
        </button>

        <span className="hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>│</span>

        {/* breadcrumb */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span style={{ color: "var(--color-ink-4)" }}>~/</span>
          {file ? (
            <>
              <span className="hidden sm:inline" style={{ color: "var(--color-ink-2)" }}>workspace</span>
              <span className="hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>/</span>
              <span className="truncate max-w-[110px] sm:max-w-none" style={{ color: "var(--color-ink)" }}>{file.filename}</span>
              <span className="ml-2 hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>{file.rows.toLocaleString()} rows</span>
              <span className="hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>·</span>
              <span className="hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>{file.columns.length} cols</span>
            </>
          ) : (
            <span style={{ color: "var(--color-ink-3)" }}>workspace/<span className="cb-caret" /></span>
          )}
        </div>

        {/* state pill */}
        <span className="inline-flex items-center gap-1.5">
          <span className={`cb-dot ${state === "ready" ? "ok" : state === "error" ? "danger" : ""}`} />
          {STATE_LABEL[state]}
        </span>

        {state !== "idle" && (
          <button
            onClick={onReset}
            className="px-2 py-1 rounded border"
            style={{ borderColor: "var(--color-line)", color: "var(--color-ink-2)" }}
          >
            esc · reset
          </button>
        )}

        <button
          onClick={toggle}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded border"
          style={{ borderColor: "var(--color-line)", background: "var(--color-bg-2)", color: "var(--color-ink-2)" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: theme === "dark" ? "var(--color-accent)" : "var(--color-ink)" }} />
          {theme.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
