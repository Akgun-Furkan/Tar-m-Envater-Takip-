import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import { daysRemaining, feedStockPercent, isFeedCritical } from "../../utils/calculations";
import { formatDate, formatNumber, formatTL } from "../../utils/format";
import Badge from "../../components/ui/Badge";
import { buttonGhost, iconButton } from "../../components/ui/styles";

function Detail({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd className="text-sm font-medium text-stone-900 dark:text-stone-100">{value}</dd>
    </div>
  );
}

export default function FeedCard({ feed, onAddStock, onEdit, onDelete }) {
  const critical = isFeedCritical(feed);
  const days = daysRemaining(feed);
  const borderColor = critical
    ? "border-red-400 dark:border-red-800"
    : "border-stone-200 dark:border-stone-800";

  return (
    <div className={`rounded-lg border bg-white p-4 dark:bg-stone-900 ${borderColor}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{feed.name}</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">Son ekleme: {formatDate(feed.lastAdded)}</p>
        </div>
        {critical && (
          <Badge tone="red"><AlertTriangle size={12} /> Kritik</Badge>
        )}
      </div>

      <div className="mt-3 text-2xl font-semibold tabular-nums">
        {formatNumber(feed.stock, 1)} <span className="text-sm font-normal text-stone-500">kg</span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
        <div
          className={`h-full ${critical ? "bg-red-500" : "bg-amber-400"}`}
          style={{ width: `${feedStockPercent(feed)}%` }}
        />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
        <Detail label="Birim maliyet" value={`${formatTL(feed.cost)} / kg`} />
        <Detail label="Mevcut stok maliyeti" value={formatTL(feed.stock * (feed.cost ?? 0))} />
        <Detail label="Günlük tüketim" value={`${formatNumber(feed.daily, 1)} kg`} />
        <Detail label="Tahmini yetecek süre" value={days === null ? "-" : `${formatNumber(days)} gün`} />
      </dl>

      <div className="mt-3 flex items-center gap-1 border-t border-stone-100 pt-3 dark:border-stone-800">
        <button className={`${buttonGhost} !px-3 !py-1.5 !text-xs`} onClick={() => onAddStock(feed)}>
          <Plus size={14} /> Stok ekle
        </button>
        <span className="flex-1" />
        <button className={iconButton} onClick={() => onEdit(feed)} aria-label="Düzenle">
          <Pencil size={16} />
        </button>
        <button className={`${iconButton} hover:!text-red-600`} onClick={() => onDelete(feed)} aria-label="Sil">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
