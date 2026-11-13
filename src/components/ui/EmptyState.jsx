export default function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-400 bg-white/75 p-10 text-center text-sm font-medium text-stone-700 backdrop-blur-md dark:border-stone-600 dark:bg-stone-900/75 dark:text-stone-300">
      {text}
    </div>
  );
}
