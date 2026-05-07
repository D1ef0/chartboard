import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  phase: "uploading" | "analyzing";
  onCancel?: () => void;
}

export function LoadingState({ phase, onCancel }: LoadingStateProps) {
  const { t } = useTranslation();
  const messages = t(
    phase === "uploading" ? "loading.messagesUpload" : "loading.messagesAnalyze",
    { returnObjects: true }
  ) as string[];

  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    setMsgIndex(0);
    const id = setInterval(() => setMsgIndex((n) => (n + 1) % messages.length), 2200);
    return () => clearInterval(id);
  }, [phase, messages.length]);

  useEffect(() => {
    if (!onCancel) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-5 py-8 sm:py-14">
      <div className="cb-mono text-[11px] tracking-wider" style={{ color: "var(--color-ink-4)" }}>
        {phase === "uploading" ? t("loading.uploadLabel") : t("loading.analyzeLabel")}
      </div>
      <h2 className="text-[28px] font-semibold tracking-tight my-2 mb-4">
        {phase === "uploading" ? t("loading.uploadHeading") : t("loading.analyzeHeading")}
        <span className="cb-caret ml-1.5" />
      </h2>

      <div className="relative h-[8px] rounded-full mb-5 overflow-hidden"
           style={{ background: "var(--color-bg-3)" }}>
        <motion.div
          className="absolute inset-y-0 rounded-full"
          style={{ background: "var(--color-accent)", width: "38%" }}
          animate={{ left: ["-38%", "100%"] }}
          transition={{ duration: 1.7, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.25 }}
        />
      </div>

      <div
        className="rounded-lg px-4 py-5 cb-mono text-[13px]"
        style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)", minHeight: "66px", display: "flex", alignItems: "center" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-2"
          >
            <span style={{ color: "var(--color-accent)" }}>$</span>
            <span style={{ color: "var(--color-ink-2)" }}>{messages[msgIndex]}</span>
            <span className="cb-caret" />
          </motion.div>
        </AnimatePresence>
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-3.5 cb-mono text-[11px]"
          style={{ background: "none", border: "none", padding: 0, color: "var(--color-ink-4)" }}
        >
          {t("loading.cancelHint")} <span className="cb-kbd">{t("loading.cancelKey")}</span> {t("loading.cancelSuffix")}
        </button>
      )}
    </div>
  );
}
