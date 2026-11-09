// Küçük, bağımsız yardımcı fonksiyonlar

export const createId = () =>
  crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2);

export const todayISO = () => new Date().toISOString().slice(0, 10);

/** "1,5" ve "1.5" biçimlerini sayıya çevirir. Geçersizse NaN döner. */
export const parseDecimal = (text) => Number(String(text ?? "").replace(",", "."));

/** Türkçe karakterlere duyarlı, büyük/küçük harf fark etmeyen arama eşleşmesi. */
export const matchesQuery = (query, ...fields) => {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return true;
  return fields.some((field) => String(field).toLocaleLowerCase("tr").includes(q));
};

/** Nesnedeki tüm değerleri metne çevirir (form input'ları metin bekler). */
export const toFormValues = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, String(value)]));
