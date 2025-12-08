import { BookOpen, GraduationCap, Target, FileCheck, Lightbulb, MessageSquare, Plus, CheckSquare, Info, Newspaper, Library, Zap, Users, Calendar, ChevronDown, Settings } from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { AIServiceIndicator } from "@/components/AIServiceIndicator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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
  {
    title: "Configure AI",
    url: "/configure-ai",
    icon: Settings,
    description: "API key settings"
  },
  {
    title: "Teacher Dashboard",
    url: "/teacher-dashboard",
    icon: Users,
    description: "Manage students"
  },
];


export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [workshopsOpen, setWorkshopsOpen] = useState(true);

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

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70 text-xs uppercase tracking-wider mb-3 font-semibold">
            Workshops
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <Collapsible open={workshopsOpen} onOpenChange={setWorkshopsOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-auto p-0">
                      <div className="flex items-center justify-between w-full rounded-lg p-3 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm font-medium">Workshops</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${workshopsOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to="/workshops/bnbuworkshop"
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2 ml-8 transition-all duration-200 ${
                                isActive
                                  ? "bg-sidebar-accent text-white"
                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                              }`
                            }
                          >
                            <span className="text-sm">11 Dec - BNBU珠海</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to="/workshops/ai-agent-workshop/archive/3dec"
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2 ml-8 transition-all duration-200 ${
                                isActive
                                  ? "bg-sidebar-accent text-white"
                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                              }`
                            }
                          >
                            <span className="text-sm text-white/50">Archive: 3 Dec</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
