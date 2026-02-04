import { FraudDashboard } from "./components/FraudDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 font-sans dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Fraud Detection Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            View fraud-related insights for a selected date range
          </p>
        </header>
        <FraudDashboard />
      </main>
    </div>
  );
}
