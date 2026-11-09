// İlk açılışta (localStorage boşken) gösterilen örnek veriler
import { createId, todayISO } from "../utils/helpers";

export const SEED_PRODUCTS = [
  { id: createId(), name: "Aronya Marmelatı", category: "Aronya Mamulü", stock: 24, cost: 70, price: 140, size: "380 g" },
  { id: createId(), name: "Aronya Suyu", category: "Aronya Mamulü", stock: 3, cost: 55, price: 120, size: "1 L" },
  { id: createId(), name: "Kestane Balı", category: "Bal Çeşitleri", stock: 18, cost: 260, price: 420, size: "850 g" },
  { id: createId(), name: "Çiçek Balı", category: "Bal Çeşitleri", stock: 40, cost: 180, price: 300, size: "850 g" },
];

export const SEED_FEEDS = [
  { id: createId(), name: "Arı Keki (Fondan)", stock: 30, cost: 0, daily: 1.5, critical: 8, lastAdded: todayISO() },
  { id: createId(), name: "Şeker Şurubu 1:1", stock: 6, cost: 0, daily: 2, critical: 10, lastAdded: todayISO() },
  { id: createId(), name: "Polen Takviyesi", stock: 12, cost: 0, daily: 0.4, critical: 3, lastAdded: todayISO() },
];
