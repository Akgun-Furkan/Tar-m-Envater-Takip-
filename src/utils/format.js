// Gösterim (biçimlendirme) fonksiyonları

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

export const formatTL = (value) => currency.format(value || 0);

export const formatNumber = (value, digits = 0) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: digits }).format(value || 0);

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "-");
