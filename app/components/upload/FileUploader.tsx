import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useTranslation } from "react-i18next";

interface FileUploaderProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function FileUploader({ onFile, disabled }: FileUploaderProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(null);
      if (rejected.length > 0) {
        setError(t("uploader.errorType"));
        return;
      }
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled,
  });

  return (
    <div className="max-w-[920px] mx-auto px-4 sm:px-5 pt-8 sm:pt-14 pb-10">
      <div className="mb-7">
        <div className="cb-mono text-[11px] tracking-wider" style={{ color: "var(--color-ink-4)" }}>
          {t("uploader.section")}
        </div>
        <h1 className="text-[36px] sm:text-[56px] leading-[1.05] font-semibold tracking-[-0.04em] mt-2 mb-1">
          {t("uploader.headline")}<br />
          <span style={{ color: "var(--color-ink-3)" }}>
            {t("uploader.subHeadlinePrefix")} <span style={{ color: "var(--color-accent)" }}>{t("uploader.subHeadlineAccent")}</span>{t("uploader.subHeadlineSuffix")}
          </span>
        </h1>
        <p className="cb-mono text-[13px] mt-3.5 max-w-[540px]" style={{ color: "var(--color-ink-3)" }}>
          {t("uploader.description")}
        </p>
      </div>

      <div
        {...getRootProps()}
        className="rounded-[10px] p-7 cursor-pointer transition-all"
        style={{
          border: `1px ${isDragActive ? "solid" : "dashed"} ${isDragActive ? "var(--color-accent)" : "var(--color-line)"}`,
          background: isDragActive ? "var(--color-accent-tint)" : "var(--color-bg-2)",
          transform: isDragActive ? "translateY(-2px)" : "none",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <input {...getInputProps()} />
        <div className="cb-mono text-[12px] mb-3.5 flex items-center gap-2.5" style={{ color: "var(--color-ink-4)" }}>
          <span style={{ color: "var(--color-accent)" }}>$</span>
          <span>{t("uploader.command")}</span>
          <span className="ml-auto" style={{ color: "var(--color-ink-4)" }}>
            {isDragActive ? t("uploader.releaseLabel") : t("uploader.dropLabel")}
          </span>
        </div>

        <div
          className="flex flex-col sm:grid items-center gap-4 px-4 sm:px-6 py-6 sm:py-8 rounded-lg min-h-[140px] sm:min-h-[180px]"
          style={{
            gridTemplateColumns: "auto 1fr auto",
            border: "1px solid var(--color-line-soft)",
            background: "var(--color-bg)",
          }}
        >
          <pre className="hidden sm:block cb-mono text-[11px] leading-[1.3] p-1.5 rounded-md whitespace-pre"
               style={{
                 color: "var(--color-ink-3)",
                 border: "1px solid var(--color-line)",
                 background: "var(--color-bg-2)",
               }}>
{`┌─────────┐
│ a │ b │ c│
├───┼───┼──┤
│ ░ │ ░ │ ░│
│ ░ │ ░ │ ░│
│ ░ │ ░ │ ░│
└───┴───┴──┘`}
          </pre>
          <div>
            <div className="text-[18px] font-semibold tracking-tight">
              {isDragActive ? t("uploader.dragActive") : t("uploader.dragIdle")}
            </div>
            <div className="cb-mono text-[12px] mt-1.5" style={{ color: "var(--color-ink-3)" }}>
              {t("uploader.accepts")}
            </div>
          </div>
          <div className="sm:self-stretch flex flex-col gap-2 sm:justify-center w-full sm:w-auto">
            <button
              type="button"
              className="px-4 py-2 rounded-md cb-mono text-[12px] font-semibold inline-flex items-center gap-2 justify-center sm:justify-start"
              style={{ background: "var(--color-ink)", color: "var(--color-bg)" }}
            >
              {t("uploader.browseButton")} <span className="cb-kbd" style={{ background: "var(--color-bg-3)" }}>⏎</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-3.5 cb-mono text-[11px]" style={{ color: "var(--color-ink-4)" }}>
          <span>{t("uploader.privacy")}</span>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-center" style={{ color: "var(--color-danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
