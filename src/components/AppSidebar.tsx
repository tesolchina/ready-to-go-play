import { BookOpen, GraduationCap, Target, FileCheck, Lightbulb, MessageSquare, Home, Plus, CheckSquare, Info, Newspaper, Library, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";

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

const navigation = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    description: "Return to dashboard"
  },
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

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-none bg-gradient-to-b from-indigo-50 to-purple-50"
    >
      <SidebarContent className="px-6 py-8">
        <SidebarGroup>
          {!isCollapsed && (
            <h1 className="text-3xl font-bold text-primary mb-8">
              AI Learning Hub for EAP
            </h1>
          )}
          
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider mb-3 font-semibold">
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
                        `block rounded-xl p-4 transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-white hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-semibold">
                              {item.title}
                            </span>
                            <span className="text-xs opacity-80">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
