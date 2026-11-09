export default function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500 dark:border-stone-700">
      {text}
    </div>
  );
}
