import { useMemo } from "react";
import { buildMarginRows, calcInventoryTotals } from "../../utils/calculations";
import { matchesQuery } from "../../utils/helpers";
import EmptyState from "../../components/ui/EmptyState";
import FinanceSummary from "./FinanceSummary";
import MarginTable from "./MarginTable";
import MonthlySalesChart from "./MonthlySalesChart";
import { formatDate, formatNumber, formatTL } from "../../utils/format";

export default function FinanceTab({ products, feeds, company, sales, query }) {
  const totals = useMemo(
    () => calcInventoryTotals(products.items, feeds.items, company.items, sales.items),
    [products.items, feeds.items, company.items, sales.items]
  );

  const marginRows = useMemo(
    () => buildMarginRows(products.items.filter((p) => matchesQuery(query, p.name, p.category))),
    [products.items, query]
  );
  const recentSales = useMemo(
    () => [...sales.items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10),
    [sales.items]
  );

  return (
    <section className="space-y-6">
      <FinanceSummary totals={totals} />

      <div>
        <h2 className="mb-3 text-base font-semibold">Aylık satış ve kâr</h2>
        <MonthlySalesChart sales={sales.items} />
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold">Son satışlar</h2>
        {recentSales.length === 0 ? (
          <EmptyState text="Henüz satış kaydı yok. Envanter sekmesinden ürün satışı kaydedebilirsin." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-b border-stone-200 text-left text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Tarih</th>
                  <th className="px-4 py-3 font-medium">Ürün</th>
                  <th className="px-4 py-3 text-right font-medium">Adet</th>
                  <th className="px-4 py-3 text-right font-medium">Ciro</th>
                  <th className="px-4 py-3 text-right font-medium">Kâr</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {recentSales.map((sale) => {
                  const profit = sale.quantity * (sale.unitPrice - sale.unitCost);
                  return (
                    <tr key={sale.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-stone-500">{formatDate(sale.date)}</td>
                      <td className="px-4 py-3 font-medium">{sale.productName}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatNumber(sale.quantity)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatTL(sale.quantity * sale.unitPrice)}</td>
                      <td className={`px-4 py-3 text-right tabular-nums ${profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {formatTL(profit)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-1 text-base font-semibold">Ürün bazlı kar marjı</h2>
        <p className="mb-3 text-xs text-stone-500 dark:text-stone-400">
          Marj = (Satış − Maliyet) ÷ Satış. Tablo en yüksek marjdan sıralanır.
        </p>
        {marginRows.length === 0 ? <EmptyState text="Gösterilecek ürün yok." /> : <MarginTable rows={marginRows} />}
      </div>
    </section>
  );
}
