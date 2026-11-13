export default function StatCard({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="rounded-lg border border-stone-300/80 bg-white/85 p-4 shadow-sm backdrop-blur-md dark:border-stone-700/80 dark:bg-stone-900/85">
      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
        <Icon size={14} /> {label}
      </div>
      <div className={`mt-2 text-xl font-semibold tabular-nums ${valueClass}`}>{value}</div>
    </div>
  );
}
