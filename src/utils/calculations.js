// İş kuralları ve hesaplamalar (arayüzden bağımsız, saf fonksiyonlar)
import { LOW_STOCK_THRESHOLD } from "../constants";

/* ── Envanter ── */
export const isLowStock = (product) => product.stock < LOW_STOCK_THRESHOLD;

/* ── Finans ── */
export function calcInventoryTotals(products, feeds = [], companyEntries = []) {
  const units = products.reduce((sum, p) => sum + p.stock, 0);
  const cost = products.reduce((sum, p) => sum + p.stock * p.cost, 0);
  const feedCost = feeds.reduce((sum, feed) => sum + feed.stock * (feed.cost ?? 0), 0);
  const revenue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const companyIncome = companyEntries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const companyExpense = companyEntries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);
  return {
    kinds: products.length,
    units,
    cost,
    feedCost,
    companyIncome,
    companyExpense,
    revenue,
    profit: revenue - cost - feedCost + companyIncome - companyExpense,
  };
}

export function calcCompanyTotals(entries) {
  const income = entries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expense = entries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);
  return { income, expense, balance: income - expense };
}

/** Kar marjı (%) = (Satış - Maliyet) / Satış */
export const calcMargin = (product) =>
  product.price > 0 ? ((product.price - product.cost) / product.price) * 100 : 0;

/** Marjı en yüksek üründen başlayarak sıralı satırlar üretir. */
export const buildMarginRows = (products) =>
  products
    .map((p) => ({
      ...p,
      unitProfit: p.price - p.cost,
      totalProfit: p.stock * (p.price - p.cost),
      margin: calcMargin(p),
    }))
    .sort((a, b) => b.margin - a.margin);

/* ── Yem takibi ── */
export const isFeedCritical = (feed) => feed.stock <= feed.critical;

export const daysRemaining = (feed) =>
  feed.daily > 0 ? Math.floor(feed.stock / feed.daily) : null;

/** Çubuk göstergesi için: kritik seviyenin 3 katı = %100 */
export const feedStockPercent = (feed) =>
  feed.critical > 0 ? Math.min(100, (feed.stock / (feed.critical * 3)) * 100) : 100;
