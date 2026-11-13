import { useMemo } from "react";
import { buildMonthlyFeedUsage, summarizeFeedUsage } from "../../utils/calculations";
import { formatNumber } from "../../utils/format";
import { tableHead, tableWrapper } from "../../components/ui/styles";

function FeedUsageChart({ months }) {
  const max = Math.max(1, ...months.map((month) => month.quantity));

  return (
    <div className="rounded-lg border border-stone-300/80 bg-white/85 p-4 shadow-sm backdrop-blur-md dark:border-stone-700/80 dark:bg-stone-900/85">
      <h3 className="mb-3 text-sm font-semibold">Aylık yem kullanımı (kg)</h3>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 720 156"
          role="img"
          aria-label="Son 12 ayın yem kullanımı, kilogram"
          className="h-40 min-w-[600px] w-full"
        >
          <line x1="20" x2="700" y1="120" y2="120" stroke="currentColor" className="text-stone-400 dark:text-stone-600" />
          {months.map((month, index) => {
            const height = (month.quantity / max) * 100;
            const x = 30 + index * 56;
            return (
              <g key={month.key}>
                <title>{`${month.label}: ${formatNumber(month.quantity, 1)} kg`}</title>
                <rect
                  x={x}
                  y={120 - height}
                  width="30"
                  height={Math.max(1, height)}
                  rx="3"
                  className="fill-emerald-700 dark:fill-emerald-400"
                />
                <text x={x + 15} y="145" textAnchor="middle" className="fill-stone-700 text-[10px] dark:fill-stone-300">
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

export default function FeedUsageReport({ usages }) {
  const months = useMemo(() => buildMonthlyFeedUsage(usages), [usages]);
  const summaries = useMemo(() => {
    const groups = new Map();
    usages.forEach((usage) => {
      const key = usage.feedId || usage.feedName;
      if (!groups.has(key)) groups.set(key, { name: usage.feedName, usages: [] });
      groups.get(key).usages.push(usage);
    });

    return [...groups.entries()]
      .map(([id, group]) => ({ id, name: group.name, ...summarizeFeedUsage(group.usages) }))
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  }, [usages]);
  const total = useMemo(() => summarizeFeedUsage(usages), [usages]);

  return (
    <section className="space-y-3 pt-3">
      <h2 className="text-lg font-semibold">Yem kullanım raporu</h2>
      <FeedUsageChart months={months} />
      <div className={tableWrapper}>
        <table className="w-full text-sm">
          <thead className={tableHead}>
            <tr>
              <th className="px-4 py-3 text-left font-medium">Yem</th>
              <th className="px-4 py-3 text-right font-medium">Toplam</th>
              <th className="px-4 py-3 text-right font-medium">Günlük ortalama</th>
              <th className="px-4 py-3 text-right font-medium">Haftalık ortalama</th>
              <th className="px-4 py-3 text-right font-medium">Aylık ortalama</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/80 dark:divide-stone-700/80">
            {summaries.map((summary) => (
              <tr key={summary.id}>
                <td className="px-4 py-3 font-medium">{summary.name}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatNumber(summary.total, 1)} kg</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatNumber(summary.daily, 1)} kg</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatNumber(summary.weekly, 1)} kg</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatNumber(summary.monthly, 1)} kg</td>
              </tr>
            ))}
            <tr className="bg-white/40 font-semibold dark:bg-stone-800/40">
              <td className="px-4 py-3">Genel toplam</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatNumber(total.total, 1)} kg</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatNumber(total.daily, 1)} kg</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatNumber(total.weekly, 1)} kg</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatNumber(total.monthly, 1)} kg</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone-700 dark:text-stone-300">
        Her yem için ortalama ilk kullanım kaydından bugüne kadar; genel toplam için tüm kayıtlar üzerinden hesaplanır.
        Haftalık ve aylık değerler günlük ortalamanın sırasıyla 7 ve 30 ile çarpımıdır.
      </p>
    </section>
  );
}
