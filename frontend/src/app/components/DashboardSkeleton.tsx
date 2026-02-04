export function DashboardSkeleton() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-8 animate-pulse">
      <div className="h-80 w-full rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50" />
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/30">
        <div className="mb-4 h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-600" />
        <div className="mb-4 h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-600" />
        <div className="flex gap-4">
          <div className="h-8 w-40 rounded bg-zinc-200 dark:bg-zinc-600" />
          <div className="h-8 w-44 rounded bg-zinc-200 dark:bg-zinc-600" />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-600" />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-20 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-600"
          />
        ))}
      </div>
    </div>
  );
}
