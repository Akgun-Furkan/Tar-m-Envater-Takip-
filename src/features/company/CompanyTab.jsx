import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Pencil, Plus, Trash2 } from "lucide-react";
import { calcCompanyTotals } from "../../utils/calculations";
import { formatDate, formatTL } from "../../utils/format";
import { matchesQuery, toFormValues } from "../../utils/helpers";
import StatCard from "../../components/ui/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import { buttonPrimary, iconButton, tableHead, tableWrapper } from "../../components/ui/styles";
import CompanyForm from "./CompanyForm";

const NEW_ENTRY = "new";

export default function CompanyTab({ company, query }) {
  const [editing, setEditing] = useState(null);
  const totals = useMemo(() => calcCompanyTotals(company.items), [company.items]);
  const visibleEntries = useMemo(
    () =>
      company.items
        .filter((entry) => matchesQuery(query, entry.name, entry.type === "income" ? "gelir" : "gider"))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [company.items, query]
  );

  const handleSave = (data) => {
    if (editing === NEW_ENTRY) company.add(data);
    else company.update(editing.id, data);
    setEditing(null);
  };

  const handleDelete = (entry) => {
    if (window.confirm(`"${entry.name}" kaydı silinsin mi?`)) company.remove(entry.id);
  };

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={ArrowDownLeft}
          label="Toplam gelir"
          value={formatTL(totals.income)}
          valueClass="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={ArrowUpRight}
          label="Toplam gider"
          value={formatTL(totals.expense)}
          valueClass="text-red-600 dark:text-red-400"
        />
        <StatCard
          icon={ArrowDownLeft}
          label="Şirket neti"
          value={formatTL(totals.balance)}
          valueClass={totals.balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
        />
      </div>

      <div className="flex justify-end">
        <button className={buttonPrimary} onClick={() => setEditing(NEW_ENTRY)}>
          <Plus size={16} /> Gelir / gider ekle
        </button>
      </div>

      {visibleEntries.length === 0 ? (
        <EmptyState text={company.items.length ? "Aramanla eşleşen şirket kalemi yok." : "Henüz gelir veya gider kaydı yok."} />
      ) : (
        <div className={tableWrapper}>
          <table className="w-full min-w-[640px] text-sm">
            <thead className={tableHead}>
              <tr>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Kalem</th>
                <th className="px-4 py-3 font-medium">Tür</th>
                <th className="px-4 py-3 text-right font-medium">Tutar</th>
                <th className="px-4 py-3 text-right font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {visibleEntries.map((entry) => {
                const isIncome = entry.type === "income";
                return (
                  <tr key={entry.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-500">{formatDate(entry.date)}</td>
                    <td className="px-4 py-3 font-medium">{entry.name}</td>
                    <td className={`px-4 py-3 ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {isIncome ? "Gelir" : "Gider"}
                    </td>
                    <td className={`whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {isIncome ? "+" : "−"}{formatTL(entry.amount)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button className={iconButton} onClick={() => setEditing(entry)} aria-label="Düzenle">
                        <Pencil size={16} />
                      </button>
                      <button className={`${iconButton} hover:!text-red-600`} onClick={() => handleDelete(entry)} aria-label="Sil">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={editing === NEW_ENTRY ? "Şirket kalemi ekle" : "Şirket kalemini düzenle"} onClose={() => setEditing(null)}>
          <CompanyForm
            initialValues={editing === NEW_ENTRY ? undefined : toFormValues(editing)}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </section>
  );
}
