import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { matchesQuery, toFormValues } from "../../utils/helpers";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { buttonPrimary, inputClass } from "../../components/ui/styles";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import SaleForm from "./SaleForm";

const ALL_CATEGORIES = "Tümü";
const NEW_PRODUCT = "new";

export default function InventoryTab({ products, sales, query }) {
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [editing, setEditing] = useState(null); // null | NEW_PRODUCT | ürün nesnesi
  const [selling, setSelling] = useState(null);

  const categories = useMemo(
    () => [...new Set(products.items.map((p) => p.category))].sort(),
    [products.items]
  );

  const visibleProducts = useMemo(
    () =>
      products.items.filter(
        (p) =>
          (category === ALL_CATEGORIES || p.category === category) &&
          matchesQuery(query, p.name, p.category)
      ),
    [products.items, category, query]
  );

  const handleSave = (data) => {
    if (editing === NEW_PRODUCT) products.add(data);
    else products.update(editing.id, data);
    setEditing(null);
  };

  const handleDelete = (product) => {
    if (window.confirm(`"${product.name}" silinsin mi?`)) products.remove(product.id);
  };

  const handleSale = (saleData) => {
    const product = products.items.find((item) => item.id === selling.id);
    if (!product || saleData.quantity > product.stock) {
      window.alert("Stok değişmiş. Satış miktarı güncel stoktan fazla olamaz.");
      setSelling(null);
      return;
    }
    products.update(product.id, { stock: product.stock - saleData.quantity });
    sales.add({
      ...saleData,
      productId: product.id,
      productName: product.name,
      unitCost: product.cost,
    });
    setSelling(null);
  };

  const emptyText = products.items.length
    ? "Aramanla eşleşen ürün yok."
    : "Henüz ürün yok. “Ürün ekle” ile ilk ürününü gir.";

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          className={`${inputClass} !w-auto`}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Kategori filtresi"
        >
          <option>{ALL_CATEGORIES}</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        <button className={buttonPrimary} onClick={() => setEditing(NEW_PRODUCT)}>
          <Plus size={16} /> Ürün ekle
        </button>
      </div>

      {visibleProducts.length === 0 ? (
        <EmptyState text={emptyText} />
      ) : (
        <ProductTable products={visibleProducts} onEdit={setEditing} onDelete={handleDelete} onSell={setSelling} />
      )}

      {editing && (
        <Modal title={editing === NEW_PRODUCT ? "Yeni ürün" : "Ürünü düzenle"} onClose={() => setEditing(null)}>
          <ProductForm
            initialValues={editing === NEW_PRODUCT ? undefined : toFormValues(editing)}
            categories={categories}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
      {selling && (
        <Modal title={`Satış kaydı: ${selling.name}`} onClose={() => setSelling(null)}>
          <SaleForm product={selling} onSubmit={handleSale} onCancel={() => setSelling(null)} />
        </Modal>
      )}
    </section>
  );
}
