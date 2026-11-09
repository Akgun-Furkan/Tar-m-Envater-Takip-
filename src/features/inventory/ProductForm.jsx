import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { validateProduct } from "../../utils/validation";
import Field from "../../components/ui/Field";
import { inputClass, buttonPrimary, buttonGhost } from "../../components/ui/styles";

const EMPTY_PRODUCT = { name: "", category: "", stock: "", cost: "", price: "", size: "" };

export default function ProductForm({ initialValues = EMPTY_PRODUCT, categories, onSubmit, onCancel }) {
  const { values, field } = useForm(initialValues);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = validateProduct(values);
    if (result.error) return setError(result.error);
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="Ürün adı">
        <input className={inputClass} autoFocus {...field("name")} />
      </Field>

      <Field label="Kategori">
        <input className={inputClass} list="kategoriler" placeholder="Örn: Aronya Mamulü" {...field("category")} />
        <datalist id="kategoriler">
          {categories.map((category) => <option key={category} value={category} />)}
        </datalist>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Stok miktarı (adet)">
          <input type="number" min="0" step="1" className={inputClass} {...field("stock")} />
        </Field>
        <Field label="Gramaj / boyut">
          <input className={inputClass} placeholder="850 g" {...field("size")} />
        </Field>
        <Field label="Birim maliyet (TL)">
          <input type="number" min="0" step="0.01" className={inputClass} {...field("cost")} />
        </Field>
        <Field label="Satış fiyatı (TL)">
          <input type="number" min="0" step="0.01" className={inputClass} {...field("price")} />
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
