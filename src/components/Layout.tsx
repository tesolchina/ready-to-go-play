import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Fixed header with sidebar toggle - always visible */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center h-full px-4">
          <SidebarTrigger className="hover:bg-accent" />
        </div>
      </header>

      <div className="flex min-h-screen w-full pt-14">
        <AppSidebar />
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
