import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { todayISO } from "../../utils/helpers";
import Field from "../../components/ui/Field";
import { buttonGhost, buttonPrimary, inputClass } from "../../components/ui/styles";

export default function SaleForm({ product, onSubmit, onCancel }) {
  const { values, field } = useForm({
    quantity: "1",
    unitPrice: String(product.price),
    date: todayISO(),
  });
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const quantity = Number(values.quantity);
    const unitPrice = Number(values.unitPrice);
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > product.stock) {
      setError(`Satış miktarı 1 ile mevcut stok (${product.stock}) arasında tam sayı olmalıdır.`);
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0 || values.unitPrice === "") {
      setError("Birim satış fiyatı 0 veya daha büyük geçerli bir sayı olmalıdır.");
      return;
    }
    if (!values.date) {
      setError("Satış tarihi zorunludur.");
      return;
    }
    onSubmit({ quantity, unitPrice, date: values.date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-stone-600 dark:text-stone-400">
        Mevcut stok: <strong>{product.stock}</strong>
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Satış adedi">
          <input type="number" min="1" max={product.stock} step="1" className={inputClass} {...field("quantity")} />
        </Field>
        <Field label="Birim satış fiyatı (TL)">
          <input type="number" min="0" step="0.01" className={inputClass} {...field("unitPrice")} />
        </Field>
        <Field label="Satış tarihi">
          <input type="date" className={inputClass} {...field("date")} />
        </Field>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className={buttonGhost} onClick={onCancel}>Vazgeç</button>
        <button type="submit" className={buttonPrimary}>Satışı kaydet</button>
      </div>
    </form>
  );
}
