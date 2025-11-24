import { BookOpen, GraduationCap, Target, FileCheck, Lightbulb, MessageSquare, Plus, CheckSquare, Info, Newspaper, Library, Zap, LogIn, LogOut, User } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AIServiceIndicator } from "@/components/AIServiceIndicator";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigation = [
  {
    title: "About",
    url: "/about",
    icon: Info,
    description: "Learn about our platform"
  },
  {
    title: "Blog",
    url: "/blog",
    icon: Newspaper,
    description: "Latest articles & insights"
  },
  {
    title: "Lessons",
    url: "/lessons",
    icon: Library,
    description: "Browse all lessons"
  },
  {
    title: "Learning Apps",
    url: "/learning-apps",
    icon: Zap,
    description: "AI-powered tools"
  },
];


export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user, signOut, isAuthenticated } = useAuth();

  return (
    <Sidebar 
      collapsible="offcanvas"
      className="border-r bg-sidebar"
    >
      <SidebarContent className="px-6 py-8">
        <SidebarGroup>
          {!isCollapsed && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-white">
                  AI Learning Hub for EAP
                </h1>
              </div>
              <div className="mb-6">
                <AIServiceIndicator />
              </div>
            </>
          )}
          
          <SidebarGroupLabel className="text-white/70 text-xs uppercase tracking-wider mb-3 font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="mb-6">
            <SidebarMenu className="gap-2">
              {navigation.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild tooltip={item.title} className="h-auto p-0">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `block rounded-lg p-3 transition-all duration-200 ${
                          isActive
                            ? "bg-sidebar-accent text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <div className="mt-auto pt-4">
            <Separator className="mb-4 bg-white/10" />
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                  <User className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white/90 truncate">
                    {user?.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                asChild
                size="sm"
                className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
                variant="outline"
              >
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
