import { todayISO } from "./helpers";

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isText = (value) => typeof value === "string";
const isNonNegative = (value) => Number.isFinite(value) && value >= 0;
const isDate = (value) => isText(value) && /^\d{4}-\d{2}-\d{2}$/.test(value);

export function createBackup({ products, feeds, feedUsages = [], company, sales }) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: { products, feeds, feedUsages, company, sales },
  };
}

export function validateBackup(backup) {
  if (!isRecord(backup) || backup.version !== 1 || !isRecord(backup.data)) return false;
  const { products, feeds, company, sales } = backup.data;
  const feedUsages = backup.data.feedUsages ?? [];
  if (![products, feeds, company, sales, feedUsages].every(Array.isArray)) return false;

  const validProducts = products.every(
    (item) =>
      isRecord(item) &&
      isText(item.id) &&
      isText(item.name) &&
      isText(item.category) &&
      isText(item.size) &&
      isNonNegative(item.stock) &&
      isNonNegative(item.cost) &&
      isNonNegative(item.price)
  );
  const validFeeds = feeds.every(
    (item) =>
      isRecord(item) &&
      isText(item.id) &&
      isText(item.name) &&
      isNonNegative(item.stock) &&
      (item.cost === undefined || isNonNegative(item.cost)) &&
      isNonNegative(item.daily) &&
      isNonNegative(item.critical) &&
      isDate(item.lastAdded)
  );
  const validCompany = company.every(
    (item) =>
      isRecord(item) &&
      isText(item.id) &&
      isText(item.name) &&
      ["income", "expense"].includes(item.type) &&
      Number.isFinite(item.amount) &&
      item.amount > 0 &&
      isDate(item.date)
  );
  const validSales = sales.every(
    (item) =>
      isRecord(item) &&
      isText(item.id) &&
      isText(item.productId) &&
      isText(item.productName) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      isNonNegative(item.unitPrice) &&
      isNonNegative(item.unitCost) &&
      isDate(item.date)
  );
  const validFeedUsages = feedUsages.every(
    (item) =>
      isRecord(item) &&
      isText(item.id) &&
      isText(item.feedId) &&
      isText(item.feedName) &&
      Number.isFinite(item.quantity) &&
      item.quantity > 0 &&
      isDate(item.date)
  );
  return validProducts && validFeeds && validCompany && validSales && validFeedUsages;
}

function csvCell(value) {
  const text = String(value ?? "");
  const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

export function createCsv({ products, feeds, feedUsages = [], company, sales }) {
  const headers = [
    "Kayıt türü", "Tarih", "Ad", "Kategori", "Miktar", "Birim",
    "Birim satış fiyatı", "Birim maliyet", "Tutar", "Kâr", "Stok",
  ];
  const rows = [
    ...products.map((item) => ["Ürün", "", item.name, item.category, "", "", item.price, item.cost, "", "", item.stock]),
    ...feeds.map((item) => ["Yem", item.lastAdded, item.name, "", "", "kg", "", item.cost ?? 0, "", "", item.stock]),
    ...feedUsages.map((item) => [
      "Yem kullanımı",
      item.date,
      item.feedName,
      "",
      item.quantity,
      "kg",
      "",
      "",
      "",
      "",
      "",
    ]),
    ...company.map((item) => [
      item.type === "income" ? "Şirket geliri" : "Şirket gideri",
      item.date,
      item.name,
      "",
      "",
      "",
      "",
      "",
      item.amount,
      "",
      "",
    ]),
    ...sales.map((item) => [
      "Satış",
      item.date,
      item.productName,
      "",
      item.quantity,
      "adet",
      item.unitPrice,
      item.unitCost,
      item.quantity * item.unitPrice,
      item.quantity * (item.unitPrice - item.unitCost),
      "",
    ]),
  ];
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export const transferFileName = (extension) => `aronya-yedek-${todayISO()}.${extension}`;
