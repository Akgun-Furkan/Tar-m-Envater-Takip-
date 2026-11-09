import { Boxes, Calculator, Wheat, Building2 } from "lucide-react";
import { TAB_IDS } from "../../constants";

const TABS = [
  { id: TAB_IDS.inventory, label: "Envanter", icon: Boxes },
  { id: TAB_IDS.finance, label: "Finans", icon: Calculator },
  { id: TAB_IDS.feed, label: "Yem takibi", icon: Wheat },
  { id: TAB_IDS.company, label: "Şirket", icon: Building2 },
];

export default function TabNav({ activeTab, onChange, alerts }) {
  return (
    <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4" aria-label="Bölümler">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        const alertCount = alerts[id] ?? 0;

        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap ${
              isActive
                ? "border-amber-500 text-stone-900 dark:text-stone-100"
                : "border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            <Icon size={16} /> {label}
            {alertCount > 0 && (
              <span className="rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                {alertCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
