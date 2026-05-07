import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, FileSpreadsheet } from "lucide-react";
import { cn } from "../../lib/utils";

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
        setError("Solo se aceptan archivos .csv y .xlsx de hasta 10 MB");
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
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]"
            : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "p-4 rounded-full transition-colors",
              isDragActive ? "bg-blue-100 dark:bg-blue-900/50" : "bg-gray-100 dark:bg-gray-800"
            )}
          >
            {isDragActive ? (
              <FileSpreadsheet className="w-10 h-10 text-blue-500" />
            ) : (
              <Upload className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {isDragActive ? "Suelta tu archivo aquí" : "Arrastra tu archivo aquí"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              o haz clic para seleccionar
            </p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            CSV o XLSX • Máximo 10 MB
          </p>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
