import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { todayISO } from "../../utils/helpers";
import { formatNumber } from "../../utils/format";
import Field from "../../components/ui/Field";
import { buttonGhost, buttonPrimary, inputClass } from "../../components/ui/styles";

export default function FeedUsageForm({ feed, onSubmit, onCancel }) {
  const { values, field } = useForm({ quantity: "", date: todayISO() });
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const quantity = Number(String(values.quantity).replace(",", "."));
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Kullanım miktarı 0'dan büyük bir sayı olmalıdır.");
      return;
    }
    if (quantity > feed.stock) {
      setError("Kullanım miktarı mevcut stoktan fazla olamaz.");
      return;
    }
    if (!values.date) {
      setError("Kullanım tarihi zorunludur.");
      return;
    }

    setError(onSubmit({ quantity, date: values.date }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-stone-600 dark:text-stone-400">
        Mevcut stok: <strong className="text-stone-900 dark:text-stone-100">{formatNumber(feed.stock, 1)} kg</strong>
      </p>
      <Field label="Kullanılan miktar (kg)">
        <input
          type="number"
          min="0.1"
          max={feed.stock}
          step="0.1"
          className={inputClass}
          autoFocus
          {...field("quantity")}
        />
      </Field>
      <Field label="Kullanım tarihi">
        <input type="date" max={todayISO()} className={inputClass} {...field("date")} />
      </Field>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className={buttonGhost} onClick={onCancel}>Vazgeç</button>
        <button type="submit" className={buttonPrimary}>Kullanımı kaydet</button>
      </div>
    </form>
  );
}
