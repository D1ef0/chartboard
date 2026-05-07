import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../lib/theme";
import type { UploadResponse, AppState } from "../../types";

interface StatusBarProps {
  file: UploadResponse | null;
  state: AppState;
  onReset: () => void;
}

export function StatusBar({ file, state, onReset }: StatusBarProps) {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();

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
              <span className="hidden sm:inline" style={{ color: "var(--color-ink-2)" }}>{t("statusBar.breadcrumb.workspace")}</span>
              <span className="hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>/</span>
              <span className="truncate max-w-[110px] sm:max-w-none" style={{ color: "var(--color-ink)" }}>{file.filename}</span>
              <span className="ml-2 hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>{t("statusBar.breadcrumb.rows", { count: file.rows.toLocaleString() })}</span>
              <span className="hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>·</span>
              <span className="hidden sm:inline" style={{ color: "var(--color-ink-4)" }}>{t("statusBar.breadcrumb.cols", { count: file.columns.length })}</span>
            </>
          ) : (
            <span style={{ color: "var(--color-ink-3)" }}>{t("statusBar.breadcrumb.workspace")}/<span className="cb-caret" /></span>
          )}
        </div>

        {/* state pill */}
        <span className="inline-flex items-center gap-1.5">
          <span className={`cb-dot ${state === "ready" ? "ok" : state === "error" ? "danger" : ""}`} />
          {t(`statusBar.states.${state}`)}
        </span>

        {state !== "idle" && (
          <button
            onClick={onReset}
            className="px-2 py-1 rounded border"
            style={{ borderColor: "var(--color-line)", color: "var(--color-ink-2)" }}
          >
            {t("statusBar.reset")}
          </button>
        )}

        {/* lang switcher */}
        <div className="inline-flex rounded border overflow-hidden" style={{ borderColor: "var(--color-line)" }}>
          {(["es", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => navigate(`/${l}`)}
              className="cb-mono text-[11px] px-2.5 py-1"
              style={{
                background: lang === l ? "var(--color-ink)" : "var(--color-bg-2)",
                color: lang === l ? "var(--color-bg)" : "var(--color-ink-3)",
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* theme toggle */}
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
