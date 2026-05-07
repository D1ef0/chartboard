import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../lib/store";
import { ChartRenderer } from "./ChartRenderer";
import type { DashboardChart } from "../../types";

const SLOT_CLASSES = [
  "col-span-full sm:col-span-4 sm:row-span-2", // hero
  "col-span-full sm:col-span-2",
  "col-span-full sm:col-span-2",
  "col-span-full sm:col-span-3",
  "col-span-full sm:col-span-3",
  "col-span-full sm:col-span-2",
  "col-span-full sm:col-span-4",
  "col-span-full sm:col-span-3",
  "col-span-full sm:col-span-3",
];

export function DashboardGrid() {
  const { dashboardCharts, removeFromDashboard, currentFile } = useAppStore();

  if (dashboardCharts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="cb-mono text-[11px] tracking-wider" style={{ color: "var(--color-ink-4)" }}>
          [04] · DASHBOARD
        </div>
        <h2 className="text-[28px] font-semibold my-2">Empty board</h2>
        <p className="cb-mono text-[12px]" style={{ color: "var(--color-ink-3)" }}>
          pin views from the suggestions panel to compose a dashboard.
        </p>
      </div>
    );
  }

  const [hero, ...rest] = dashboardCharts;

  return (
    <div>
      {currentFile && (
        <div className="grid gap-2.5 mb-4 grid-cols-2 sm:grid-cols-4">
          {[
            { l: "rows analyzed", v: currentFile.rows.toLocaleString(), d: "+0" },
            { l: "views pinned", v: dashboardCharts.length, d: `${Math.max(dashboardCharts.length - 1, 0)} secondary` },
            { l: "columns", v: currentFile.columns.length, d: "schema ok" },
            { l: "freshness", v: "live", d: "session active" },
          ].map((k) => (
            <div
              key={k.l}
              className="px-3.5 py-3 rounded-md"
              style={{ border: "1px solid var(--color-line)", background: "var(--color-bg-2)" }}
            >
              <div className="cb-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ink-4)" }}>
                {k.l}
              </div>
              <div className="text-[22px] font-semibold mt-1 tracking-tight">{k.v}</div>
              <div className="cb-mono text-[11px]" style={{ color: "var(--color-ink-3)" }}>{k.d}</div>
            </div>
          ))}
        </div>
      )}

      <div
        className="grid gap-3.5 grid-cols-1 sm:grid-cols-6"
        style={{ gridAutoRows: "minmax(150px, auto)" }}
      >
        <AnimatePresence>
          <ChartCard key={hero.id} chart={hero} index={0} slotClass={SLOT_CLASSES[0]} hero onRemove={() => removeFromDashboard(hero.id)} />
          {rest.map((c, i) => (
            <ChartCard key={c.id} chart={c} index={i + 1} slotClass={SLOT_CLASSES[Math.min(i + 1, SLOT_CLASSES.length - 1)]} onRemove={() => removeFromDashboard(c.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChartCard({
  chart, index, hero, slotClass, onRemove,
}: { chart: DashboardChart; index: number; hero?: boolean; slotClass: string; onRemove: () => void }) {
  const s = chart.suggestion;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`flex flex-col ${slotClass}`}
      style={{
        border: "1px solid var(--color-line)",
        borderRadius: 8,
        background: "var(--color-bg-2)",
        padding: hero ? "18px 18px 12px" : "14px 14px 8px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CornerTicks />
      <div className="flex items-start justify-between gap-2.5 mb-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 cb-mono text-[10px] mb-1" style={{ color: "var(--color-ink-4)" }}>
            <span
              className="px-1.5 py-[1px] rounded"
              style={{
                border: `1px solid ${hero ? "var(--color-accent)" : "var(--color-line)"}`,
                color: hero ? "var(--color-accent)" : "var(--color-ink-3)",
              }}
            >
              [{String(index + 1).padStart(2, "0")}]
            </span>
            <span className="uppercase">{s.chart_type}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{s.parameters.x_axis} → {s.parameters.y_axis ?? "—"}</span>
            {hero && <span className="ml-1.5 tracking-wider" style={{ color: "var(--color-accent)" }}>HERO</span>}
          </div>
          <div className="font-semibold tracking-tight" style={{ fontSize: hero ? 22 : 15 }}>
            {s.title}
          </div>
          {hero && (
            <div className="cb-mono text-[12px] mt-1.5 max-w-[640px]" style={{ color: "var(--color-ink-3)" }}>
              {s.insight}
            </div>
          )}
        </div>
        <button
          onClick={onRemove}
          className="w-6 h-6 grid place-items-center rounded cb-mono text-[12px]"
          style={{ border: "1px solid var(--color-line-soft)", background: "var(--color-bg)", color: "var(--color-ink-3)" }}
        >
          ×
        </button>
      </div>
      <div className="flex-1" style={{ minHeight: hero ? 320 : 150 }}>
        <ChartRenderer chart={chart} />
      </div>
      {!hero && (
        <div className="cb-mono text-[11px] mt-1 leading-[1.5]" style={{ color: "var(--color-ink-3)" }}>
          {s.insight}
        </div>
      )}
    </motion.div>
  );
}

function CornerTicks() {
  const tick: React.CSSProperties = {
    position: "absolute", width: 8, height: 8,
    borderColor: "var(--color-ink-4)", opacity: 0.5,
  };
  return (
    <>
      <span style={{ ...tick, top: 6, left: 6, borderTop: "1px solid", borderLeft: "1px solid" }} />
      <span style={{ ...tick, top: 6, right: 6, borderTop: "1px solid", borderRight: "1px solid" }} />
      <span style={{ ...tick, bottom: 6, left: 6, borderBottom: "1px solid", borderLeft: "1px solid" }} />
      <span style={{ ...tick, bottom: 6, right: 6, borderBottom: "1px solid", borderRight: "1px solid" }} />
    </>
  );
}
