import "@/styles/globals.css";

export default function App() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <main className="flex flex-1 flex-col">
        <header className="flex items-center border-b px-4 py-2">
          <h1 className="text-sm font-semibold">Clip History</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-8 text-muted-foreground">
          <p className="text-sm">v0.1.0 — 项目初始化成功</p>
        </div>
      </main>
    </div>
  );
}
