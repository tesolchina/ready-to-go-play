export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
        <h1 className="text-lg font-semibold">AI Prompting for Educators</h1>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
