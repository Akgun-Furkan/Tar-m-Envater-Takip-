import { useMemo } from "react";
import { buildMonthlySales } from "../../utils/calculations";
import { formatTL } from "../../utils/format";

function MonthlyBarChart({ title, months, metric, color }) {
  const max = Math.max(1, ...months.map((month) => Math.abs(month[metric])));
  const chartHeight = 120;
  const baseline = metric === "profit" && months.some((month) => month.profit < 0) ? 76 : chartHeight;
  const availableHeight = metric === "profit" ? (baseline === chartHeight ? chartHeight : 64) : chartHeight;

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 720 ${chartHeight + 36}`}
          role="img"
          aria-label={`${title}, son 12 ay`}
          className="h-40 min-w-[600px] w-full"
        >
          <line x1="20" x2="700" y1={baseline} y2={baseline} stroke="currentColor" className="text-stone-300 dark:text-stone-700" />
          {months.map((month, index) => {
            const value = month[metric];
            const barHeight = (Math.abs(value) / max) * availableHeight;
            const x = 30 + index * 56;
            const y = metric === "profit" && value < 0 ? baseline : baseline - barHeight;
            return (
              <g key={month.key}>
                <title>{`${month.label}: ${formatTL(value)}`}</title>
                <rect x={x} y={y} width="30" height={Math.max(1, barHeight)} rx="3" className={color} />
                <text x={x + 15} y={chartHeight + 20} textAnchor="middle" className="fill-stone-500 text-[10px]">
                  {month.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function MonthlySalesChart({ sales }) {
  const months = useMemo(() => buildMonthlySales(sales), [sales]);
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <MonthlyBarChart title="Aylık satış cirosu" months={months} metric="revenue" color="fill-amber-500" />
      <MonthlyBarChart title="Aylık satış kârı" months={months} metric="profit" color="fill-emerald-500" />
    </div>
  );
}
