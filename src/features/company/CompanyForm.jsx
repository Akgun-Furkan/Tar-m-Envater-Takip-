import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { todayISO } from "../../utils/helpers";
import { validateCompanyEntry } from "../../utils/validation";
import Field from "../../components/ui/Field";
import { inputClass, buttonPrimary, buttonGhost } from "../../components/ui/styles";

const EMPTY_ENTRY = () => ({ name: "", type: "expense", amount: "", date: todayISO() });

export default function CompanyForm({ initialValues, onSubmit, onCancel }) {
  const { values, field } = useForm(initialValues ?? EMPTY_ENTRY());
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = validateCompanyEntry(values);
    if (result.error) return setError(result.error);
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="Kalem adı">
        <input
          className={inputClass}
          autoFocus
          placeholder="İşçilik ödemesi, kira geliri…"
          {...field("name")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="İşlem türü">
          <select className={inputClass} {...field("type")}>
            <option value="expense">Gider</option>
            <option value="income">Gelir</option>
          </select>
        </Field>
        <Field label="Tutar (TL)">
          <input type="number" min="0.01" step="0.01" className={inputClass} {...field("amount")} />
        </Field>
        <Field label="İşlem tarihi">
          <input type="date" className={inputClass} {...field("date")} />
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
