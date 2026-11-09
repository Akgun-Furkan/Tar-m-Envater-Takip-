export default function StatCard({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
        <Icon size={14} /> {label}
      </div>
      <div className={`mt-2 text-xl font-semibold tabular-nums ${valueClass}`}>{value}</div>
    </div>
  );
}
