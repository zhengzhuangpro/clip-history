import "@/styles/globals.css";
import { HistoryList } from "@/components/HistoryList";

export default function App() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center border-b px-4 py-2">
        <h1 className="text-sm font-semibold">Clip History</h1>
      </header>
      <HistoryList />
    </div>
  );
}
