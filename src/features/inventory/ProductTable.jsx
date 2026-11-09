import { AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { isLowStock } from "../../utils/calculations";
import { formatNumber, formatTL } from "../../utils/format";
import Badge from "../../components/ui/Badge";
import { iconButton, tableHead, tableWrapper } from "../../components/ui/styles";

const COLUMNS = ["Ürün", "Kategori", "Boyut", "Stok", "Maliyet", "Satış", ""];
const RIGHT_ALIGNED = [3, 4, 5];

function StockCell({ stock, low }) {
  return (
    <div className="flex items-center justify-end gap-2">
      {low && (
        <Badge tone="red">
          <AlertTriangle size={12} /> {stock === 0 ? "Tükendi" : "Az kaldı"}
        </Badge>
      )}
      {formatNumber(stock)}
    </div>
  );
}

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className={tableWrapper}>
      <table className="w-full min-w-[760px] text-sm">
        <thead className={tableHead}>
          <tr>
            {COLUMNS.map((title, index) => (
              <th key={index} className={`px-4 py-3 font-medium ${RIGHT_ALIGNED.includes(index) ? "text-right" : ""}`}>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{product.category}</td>
              <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{product.size || "-"}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                <StockCell stock={product.stock} low={isLowStock(product)} />
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{formatTL(product.cost)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatTL(product.price)}</td>
              <td className="whitespace-nowrap px-2 py-2 text-right">
                <button className={iconButton} onClick={() => onEdit(product)} aria-label="Düzenle">
                  <Pencil size={16} />
                </button>
                <button className={`${iconButton} hover:!text-red-600`} onClick={() => onDelete(product)} aria-label="Sil">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
