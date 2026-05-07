import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUploader } from "../components/upload/FileUploader";
import { LoadingState } from "../components/upload/LoadingState";
import { PromptInput } from "../components/upload/PromptInput";
import { SuggestionsGrid } from "../components/analysis/SuggestionsGrid";
import { DashboardGrid } from "../components/dashboard/DashboardGrid";
import { StatusBar } from "../components/shell/StatusBar";
import { uploadFile, analyzeFile, downloadDataset } from "../lib/api";
import { useAppStore } from "../lib/store";

export function meta() {
  return [
    { title: "chartboard — analista de datos con IA" },
    { name: "description", content: "Convierte tu hoja de cálculo en un dashboard en un solo respiro." },
  ];
}

type View = "compose" | "dashboard";

export default function Home() {
  const { state, analysis, currentFile, reset, setState, setFile, setAnalysis } = useAppStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<"csv" | "xlsx" | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [view, setView] = useState<View>("compose");
  const abortRef = useRef<AbortController | null>(null);

  const handleDownload = async (format: "csv" | "xlsx") => {
    if (!currentFile || downloading) return;
    setDownloading(format);
    try {
      await downloadDataset(currentFile.file_id, currentFile.filename, format);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al descargar");
    } finally {
      setDownloading(null);
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    reset();
  };

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setState("uploading");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await uploadFile(file, ctrl.signal);
      if (ctrl.signal.aborted) return;
      abortRef.current = null;
      setFile(res);
      setState("prompting");
    } catch (err) {
      if (ctrl.signal.aborted || (err as Error).name === "AbortError") return;
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setState("error");
    }
  };

  const handleAnalyze = async (prompt: string) => {
    if (!currentFile) return;
    setLastPrompt(prompt);
    setErrorMsg(null);
    setState("analyzing");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await analyzeFile(currentFile.file_id, prompt, ctrl.signal);
      if (ctrl.signal.aborted) return;
      abortRef.current = null;
      setAnalysis(res);
      setView("compose");
      setState("ready");
    } catch (err) {
      if (ctrl.signal.aborted || (err as Error).name === "AbortError") return;
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setState("error");
    }
  };

  const handleRetry = async () => {
    if (!currentFile) return;
    setErrorMsg(null);
    setState("analyzing");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await analyzeFile(currentFile.file_id, lastPrompt, ctrl.signal);
      if (ctrl.signal.aborted) return;
      abortRef.current = null;
      setAnalysis(res);
      setState("ready");
    } catch (err) {
      if (ctrl.signal.aborted || (err as Error).name === "AbortError") return;
      setErrorMsg(err instanceof Error ? err.message : "Error al analizar");
      setState("error");
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <StatusBar file={currentFile} state={state} onReset={reset} />

      <div className="cb-grid-bg" style={{ minHeight: "calc(100vh - 50px)" }}>
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <FileUploader onFile={handleFile} />
            </motion.div>
          )}

          {(state === "uploading" || state === "analyzing") && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState phase={state === "uploading" ? "uploading" : "analyzing"} onCancel={handleCancel} />
            </motion.div>
          )}

          {state === "prompting" && currentFile && (
            <motion.div key="prompting" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <PromptInput
                filename={currentFile.filename}
                rows={currentFile.rows}
                columns={currentFile.columns.length}
                columnNames={currentFile.columns}
                columnTypes={currentFile.column_types}
                onAnalyze={handleAnalyze}
                onBack={reset}
              />
            </motion.div>
          )}

          {state === "error" && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="max-w-[760px] mx-auto px-5 py-14">
              <div className="cb-mono text-[11px] tracking-wider" style={{ color: "var(--color-danger)" }}>
                [!!] · STDERR
              </div>
              <h2 className="text-[28px] font-semibold tracking-tight my-2 mb-4">
                Process exited with errors.
              </h2>
              <div
                className="rounded-lg px-4 py-4 cb-mono text-[13px]"
                style={{
                  border: "1px solid var(--color-danger)",
                  background: "var(--color-danger-tint)",
                  color: "var(--color-ink)",
                }}
              >
                <div className="mb-1.5" style={{ color: "var(--color-danger)" }}>error · 0x42</div>
                <div style={{ color: "var(--color-ink-2)" }}>{errorMsg ?? "Error desconocido"}</div>
              </div>
              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={reset}
                  className="cb-mono text-[12px] px-3.5 py-2 rounded-md"
                  style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)", color: "var(--color-ink-2)" }}
                >
                  new file
                </button>
                {currentFile && (
                  <button
                    onClick={handleRetry}
                    className="cb-mono text-[12px] font-semibold px-3.5 py-2 rounded-md"
                    style={{ background: "var(--color-accent)", color: "oklch(0.18 0.05 60)" }}
                  >
                    retry analysis
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {state === "ready" && analysis && (
            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="max-w-[1400px] mx-auto px-5 py-7">
              <div className="flex items-center gap-2 mb-5 cb-mono text-[12px]">
                {(["compose", "dashboard"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="px-3 py-1.5 rounded-md"
                    style={{
                      background: view === v ? "var(--color-ink)" : "transparent",
                      color: view === v ? "var(--color-bg)" : "var(--color-ink-3)",
                      border: `1px solid ${view === v ? "var(--color-ink)" : "var(--color-line-soft)"}`,
                    }}
                  >
                    {v}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  {(["csv", "xlsx"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleDownload(fmt)}
                      disabled={!!downloading}
                      className="cb-mono text-[11px] px-2.5 py-1.5 rounded-md disabled:opacity-50"
                      style={{ border: "1px solid var(--color-line)", color: "var(--color-ink-2)", background: "var(--color-bg-2)" }}
                    >
                      ↓ {downloading === fmt ? "…" : fmt}
                    </button>
                  ))}
                </div>
              </div>

              {view === "compose" ? (
                <SuggestionsGrid analysis={analysis} onContinue={() => setView("dashboard")} />
              ) : (
                <DashboardGrid />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
