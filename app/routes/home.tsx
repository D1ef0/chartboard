import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles, Download, FileDown } from "lucide-react";
import { FileUploader } from "../components/upload/FileUploader";
import { LoadingState } from "../components/upload/LoadingState";
import { SuggestionsGrid } from "../components/analysis/SuggestionsGrid";
import { DashboardGrid } from "../components/dashboard/DashboardGrid";
import { uploadFile, analyzeFile, downloadDataset } from "../lib/api";
import { useAppStore } from "../lib/store";

export function meta() {
  return [
    { title: "Análisis al Instante — Dashboard con IA" },
    { name: "description", content: "Convierte tu hoja de cálculo en insights con IA" },
  ];
}

export default function Home() {
  const { state, analysis, currentFile, reset, setState, setFile, setAnalysis } = useAppStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<"csv" | "xlsx" | null>(null);

  const handleDownload = async (format: "csv" | "xlsx") => {
    if (!currentFile || downloading) return;
    setDownloading(format);
    try {
      await downloadDataset(currentFile.file_id, currentFile.filename, format);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al descargar";
      setErrorMsg(msg);
    } finally {
      setDownloading(null);
    }
  };

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setState("uploading");

    try {
      const uploadResult = await uploadFile(file);
      setFile(uploadResult);

      // minimum loading feel
      const minDelay = new Promise((r) => setTimeout(r, 1200));

      setState("analyzing");
      const [analysisResult] = await Promise.all([
        analyzeFile(uploadResult.file_id),
        minDelay,
      ]);

      setAnalysis(analysisResult);
      setState("ready");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setErrorMsg(msg);
      setState("error");
    }
  };

  const handleRetryAnalysis = async () => {
    if (!currentFile) return;
    setErrorMsg(null);
    setState("analyzing");
    try {
      const result = await analyzeFile(currentFile.file_id);
      setAnalysis(result);
      setState("ready");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al analizar";
      setErrorMsg(msg);
      setState("error");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Análisis al Instante
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Convierte tu hoja de cálculo en insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Download buttons — visible as soon as a file is uploaded */}
            {currentFile && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                  Descargar:
                </span>
                {(["csv", "xlsx"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleDownload(fmt)}
                    disabled={!!downloading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-900"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloading === fmt ? "..." : fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            {state !== "idle" && (
              <button
                onClick={reset}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Nuevo archivo
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Idle: Upload */}
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col items-center gap-6 py-12"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  ¿Tienes datos sin analizar?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Sube tu CSV o Excel y la IA te sugerirá las visualizaciones más reveladoras en segundos.
                </p>
              </div>
              <FileUploader onFile={handleFile} />
              <a
                href="/sample.csv"
                download="sample_ventas.csv"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Descargar CSV de ejemplo
              </a>
            </motion.div>
          )}

          {/* Loading */}
          {(state === "uploading" || state === "analyzing") && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState phase={state === "uploading" ? "uploading" : "analyzing"} />
            </motion.div>
          )}

          {/* Error */}
          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 py-12"
            >
              <div className="text-center space-y-2">
                <p className="text-red-500 font-medium">{errorMsg}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  Subir otro archivo
                </button>
                {currentFile && (
                  <button
                    onClick={handleRetryAnalysis}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                  >
                    Reintentar análisis
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Ready: Analysis + Dashboard */}
          {state === "ready" && analysis && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {currentFile && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {currentFile.filename}
                  </span>
                  <span>•</span>
                  <span>{currentFile.rows.toLocaleString()} filas</span>
                  <span>•</span>
                  <span>{currentFile.columns.length} columnas</span>
                </div>
              )}

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Sugerencias de análisis
                </h2>
                <SuggestionsGrid analysis={analysis} />
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Dashboard
                </h2>
                <DashboardGrid />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
