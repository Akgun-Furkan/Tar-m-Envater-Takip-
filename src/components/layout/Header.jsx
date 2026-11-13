import { Hexagon, Search } from "lucide-react";
import { inputClass } from "../ui/styles";
import TabNav from "./TabNav";
import DataActions from "./DataActions";

export default function Header({ query, onQueryChange, activeTab, onTabChange, alerts, collections }) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-300/80 bg-white/85 shadow-sm backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-900/85">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <Hexagon className="text-amber-500" fill="currentColor" size={26} />
          <div className="leading-tight">
            <div className="font-semibold">Aronya</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Tarım ve envanter paneli</div>
          </div>
        </div>

        <div className="relative ml-auto w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            className={`${inputClass} pl-9`}
            placeholder="Ürün, yem veya şirket kalemi ara…"
            aria-label="Ara"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      </div>

      <DataActions collections={collections} />
      <TabNav activeTab={activeTab} onChange={onTabChange} alerts={alerts} />
    </header>
  );
}
