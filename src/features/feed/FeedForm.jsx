import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { todayISO } from "../../utils/helpers";
import { validateFeed } from "../../utils/validation";
import Field from "../../components/ui/Field";
import { inputClass, buttonPrimary, buttonGhost } from "../../components/ui/styles";

const emptyFeed = () => ({ name: "", stock: "", cost: "", daily: "", critical: "5", lastAdded: todayISO() });

export default function FeedForm({ initialValues, onSubmit, onCancel }) {
  const { values, field } = useForm(
    initialValues ? { ...initialValues, cost: initialValues.cost ?? "0" } : emptyFeed()
  );
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = validateFeed(values);
    if (result.error) return setError(result.error);
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="Yem / takviye adı">
        <input className={inputClass} autoFocus placeholder="Arı keki, şerbet, polen…" {...field("name")} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Stok (kg)">
          <input type="number" min="0" step="0.1" className={inputClass} {...field("stock")} />
        </Field>
        <Field label="Birim maliyet (TL/kg)">
          <input type="number" min="0" step="0.01" className={inputClass} {...field("cost")} />
        </Field>
        <Field label="Günlük tüketim tahmini (kg)">
          <input type="number" min="0" step="0.1" className={inputClass} {...field("daily")} />
        </Field>
        <Field label="Kritik seviye (kg)">
          <input type="number" min="0" step="0.1" className={inputClass} {...field("critical")} />
        </Field>
        <Field label="Son eklenme tarihi">
          <input type="date" className={inputClass} {...field("lastAdded")} />
        </Field>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className={buttonGhost} onClick={onCancel}>Vazgeç</button>
        <button type="submit" className={buttonPrimary}>Kaydet</button>
      </div>
    </form>
  );
}
