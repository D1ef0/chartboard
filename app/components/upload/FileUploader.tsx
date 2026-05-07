import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";

interface FileUploaderProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function FileUploader({ onFile, disabled }: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(null);
      if (rejected.length > 0) {
        setError("Solo se aceptan .csv y .xlsx de hasta 10 MB");
        return;
      }
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile]
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
    <div className="max-w-[920px] mx-auto px-5 pt-14 pb-10">
      <div className="mb-7">
        <div className="cb-mono text-[11px] tracking-wider" style={{ color: "var(--color-ink-4)" }}>
          [01] · INPUT
        </div>
        <h1 className="text-[56px] leading-[1.05] font-semibold tracking-[-0.04em] mt-2 mb-1">
          Drop a sheet.<br />
          <span style={{ color: "var(--color-ink-3)" }}>
            Get a dashboard in <span style={{ color: "var(--color-accent)" }}>one breath</span>.
          </span>
        </h1>
        <p className="cb-mono text-[13px] mt-3.5 max-w-[540px]" style={{ color: "var(--color-ink-3)" }}>
          point-it-at your <span style={{ color: "var(--color-ink-2)" }}>.csv</span> or{" "}
          <span style={{ color: "var(--color-ink-2)" }}>.xlsx</span>. an analyst-grade model reads the columns,
          proposes the most revealing views, you compose.
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
          <span>chartboard <span style={{ color: "var(--color-ink-2)" }}>upload</span> --auto-detect</span>
          <span className="ml-auto" style={{ color: "var(--color-ink-4)" }}>
            {isDragActive ? "release to upload ↓" : "drop · or click to browse"}
          </span>
        </div>

        <div
          className="grid items-center gap-4 px-6 py-8 rounded-lg min-h-[180px]"
          style={{
            gridTemplateColumns: "auto 1fr auto",
            border: "1px solid var(--color-line-soft)",
            background: "var(--color-bg)",
          }}
        >
          <pre className="cb-mono text-[11px] leading-[1.3] p-1.5 rounded-md whitespace-pre"
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
              {isDragActive ? "Release to begin parsing" : "Drag your file into this box"}
            </div>
            <div className="cb-mono text-[12px] mt-1.5" style={{ color: "var(--color-ink-3)" }}>
              accepts: <span style={{ color: "var(--color-ink-2)" }}>.csv</span> ·{" "}
              <span style={{ color: "var(--color-ink-2)" }}>.xlsx</span> &nbsp; · &nbsp; max{" "}
              <span style={{ color: "var(--color-ink-2)" }}>10MB</span>
            </div>
          </div>
          <div className="self-stretch flex flex-col gap-2 justify-center">
            <button
              type="button"
              className="px-4 py-2 rounded-md cb-mono text-[12px] font-semibold inline-flex items-center gap-2"
              style={{ background: "var(--color-ink)", color: "var(--color-bg)" }}
            >
              browse <span className="cb-kbd" style={{ background: "var(--color-bg-3)" }}>⏎</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-3.5 cb-mono text-[11px]" style={{ color: "var(--color-ink-4)" }}>
          <span>data stays in your session · no training</span>
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
