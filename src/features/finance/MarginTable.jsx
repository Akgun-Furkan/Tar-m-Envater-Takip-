import { formatNumber, formatTL } from "../../utils/format";
import { tableHead, tableWrapper } from "../../components/ui/styles";

const LOW_MARGIN = 20; // % — altı sarı uyarı rengi

function marginColor(margin) {
  if (margin < 0) return "bg-red-500";
  if (margin < LOW_MARGIN) return "bg-amber-400";
  return "bg-emerald-500";
}

function MarginBar({ margin }) {
  const width = Math.min(100, Math.max(0, margin));
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-32 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
        <div className={`h-full ${marginColor(margin)}`} style={{ width: `${width}%` }} />
      </div>
      <span className="w-14 tabular-nums">%{formatNumber(margin, 1)}</span>
    </div>
  );
}

export default function MarginTable({ rows }) {
  return (
    <div className={tableWrapper}>
      <table className="w-full min-w-[680px] text-sm">
        <thead className={tableHead}>
          <tr>
            <th className="px-4 py-3 font-medium">Ürün</th>
            <th className="px-4 py-3 text-right font-medium">Birim kar</th>
            <th className="px-4 py-3 text-right font-medium">Stoktaki toplam kar</th>
            <th className="px-4 py-3 font-medium">Kar marjı</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 font-medium">
                {row.name}
                <div className="text-xs font-normal text-stone-500">{row.category}</div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{formatTL(row.unitProfit)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatTL(row.totalProfit)}</td>
              <td className="px-4 py-3"><MarginBar margin={row.margin} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
