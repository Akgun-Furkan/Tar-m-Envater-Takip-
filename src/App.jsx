import { useState } from "react";
import { STORAGE_KEYS, TAB_IDS } from "./constants";
import { SEED_FEEDS, SEED_PRODUCTS } from "./data/seedData";
import { useCollection } from "./hooks/useCollection";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { isFeedCritical, isLowStock } from "./utils/calculations";
import Header from "./components/layout/Header";
import InventoryTab from "./features/inventory/InventoryTab";
import FinanceTab from "./features/finance/FinanceTab";
import FeedTab from "./features/feed/FeedTab";
import CompanyTab from "./features/company/CompanyTab";

export default function App() {
  const products = useCollection(STORAGE_KEYS.products, SEED_PRODUCTS);
  const feeds = useCollection(STORAGE_KEYS.feeds, SEED_FEEDS);
  const feedUsages = useCollection(STORAGE_KEYS.feedUsages);
  const company = useCollection(STORAGE_KEYS.company);
  const sales = useCollection(STORAGE_KEYS.sales);
  const [activeTab, setActiveTab] = useLocalStorage(STORAGE_KEYS.tab, TAB_IDS.inventory);
  const [query, setQuery] = useState("");

  // Sekme başlıklarındaki kırmızı uyarı sayıları
  const alerts = {
    [TAB_IDS.inventory]: products.items.filter(isLowStock).length,
    [TAB_IDS.feed]: feeds.items.filter(isFeedCritical).length,
  };

  return (
    <div
      className="relative min-h-screen text-stone-900 dark:text-stone-100"
      style={{
        backgroundImage: "url('/aronya-background.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-white/25 dark:bg-stone-950/35" />
      <div className="relative z-10">
        <Header
          query={query}
          onQueryChange={setQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alerts={alerts}
          collections={{ products, feeds, feedUsages, company, sales }}
        />

        <main className="mx-auto max-w-6xl px-4 py-6">
          {activeTab === TAB_IDS.inventory && <InventoryTab products={products} sales={sales} query={query} />}
          {activeTab === TAB_IDS.finance && (
            <FinanceTab products={products} feeds={feeds} company={company} sales={sales} query={query} />
          )}
          {activeTab === TAB_IDS.feed && <FeedTab feeds={feeds} feedUsages={feedUsages} query={query} />}
          {activeTab === TAB_IDS.company && <CompanyTab company={company} query={query} />}
        </main>
      </div>
    </div>
  );
}
