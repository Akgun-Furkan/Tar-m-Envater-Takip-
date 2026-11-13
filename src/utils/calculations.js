// İş kuralları ve hesaplamalar (arayüzden bağımsız, saf fonksiyonlar)
import { LOW_STOCK_THRESHOLD } from "../constants";

/* ── Envanter ── */
export const isLowStock = (product) => product.stock < LOW_STOCK_THRESHOLD;

/* ── Finans ── */
export function calcInventoryTotals(products, feeds = [], companyEntries = [], sales = []) {
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
  const salesRevenue = sales.reduce((sum, sale) => sum + sale.quantity * sale.unitPrice, 0);
  const salesProfit = sales.reduce(
    (sum, sale) => sum + sale.quantity * (sale.unitPrice - sale.unitCost),
    0
  );
  return {
    kinds: products.length,
    units,
    cost,
    feedCost,
    companyIncome,
    companyExpense,
    salesRevenue,
    salesProfit,
    revenue,
    profit: revenue - cost + salesProfit - feedCost + companyIncome - companyExpense,
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

export function buildMonthlySales(sales, now = new Date()) {
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      key,
      label: date.toLocaleDateString("tr-TR", { month: "short", year: "2-digit" }),
      revenue: 0,
      profit: 0,
    };
  });
  const monthByKey = new Map(months.map((month) => [month.key, month]));

  sales.forEach((sale) => {
    const month = monthByKey.get(sale.date.slice(0, 7));
    if (!month) return;
    month.revenue += sale.quantity * sale.unitPrice;
    month.profit += sale.quantity * (sale.unitPrice - sale.unitCost);
  });

  return months;
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

export function buildMonthlyFeedUsage(usages, now = new Date()) {
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      key,
      label: date.toLocaleDateString("tr-TR", { month: "short", year: "2-digit" }),
      quantity: 0,
    };
  });
  const monthByKey = new Map(months.map((month) => [month.key, month]));

  usages.forEach((usage) => {
    const month = monthByKey.get(usage.date.slice(0, 7));
    if (month) month.quantity += usage.quantity;
  });

  return months;
}

export function summarizeFeedUsage(usages, now = new Date()) {
  const total = usages.reduce((sum, usage) => sum + usage.quantity, 0);
  if (usages.length === 0) return { total: 0, daily: 0, weekly: 0, monthly: 0, days: 0 };

  const firstDate = usages.reduce(
    (first, usage) => (usage.date < first ? usage.date : first),
    usages[0].date
  );
  const start = new Date(`${firstDate}T00:00:00Z`);
  const end = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.max(1, Math.floor((end - start.getTime()) / 86400000) + 1);
  const daily = total / days;

  return { total, daily, weekly: daily * 7, monthly: daily * 30, days };
}
