import { useMemo } from "react";
import { buildMarginRows, calcInventoryTotals } from "../../utils/calculations";
import { matchesQuery } from "../../utils/helpers";
import EmptyState from "../../components/ui/EmptyState";
import FinanceSummary from "./FinanceSummary";
import MarginTable from "./MarginTable";

export default function FinanceTab({ products, feeds, company, query }) {
  const totals = useMemo(
    () => calcInventoryTotals(products.items, feeds.items, company.items),
    [products.items, feeds.items, company.items]
  );

  const marginRows = useMemo(
    () => buildMarginRows(products.items.filter((p) => matchesQuery(query, p.name, p.category))),
    [products.items, query]
  );

  return (
    <section className="space-y-6">
      <FinanceSummary totals={totals} />

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
