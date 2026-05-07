const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.detail ?? text;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<import("../types").UploadResponse>(res);
}

export async function analyzeFile(fileId: string) {
  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId }),
  });
  return handleResponse<import("../types").AnalysisResponse>(res);
}

export async function getChartData(
  fileId: string,
  chartType: string,
  parameters: import("../types").ChartParameters
) {
  const res = await fetch(`${API_URL}/api/chart-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file_id: fileId,
      chart_type: chartType,
      parameters,
    }),
  });
  return handleResponse<import("../types").ChartDataResponse>(res);
}

export async function downloadDataset(
  fileId: string,
  originalFilename: string,
  format: "csv" | "xlsx" = "csv"
) {
  const res = await fetch(`${API_URL}/api/download/${fileId}?format=${format}`);
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try { message = JSON.parse(text).detail ?? text; } catch {}
    throw new Error(message);
  }
  const blob = await res.blob();
  const baseName = originalFilename.replace(/\.(csv|xlsx)$/i, "");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName}_procesado.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
