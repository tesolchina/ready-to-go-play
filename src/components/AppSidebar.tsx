import { BookOpen, GraduationCap, Target, FileCheck, Lightbulb } from "lucide-react";
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

const lessons = [
  { 
    id: 1, 
    title: "Prompt Engineering Basics", 
    url: "/lesson/1", 
    icon: BookOpen,
    description: "Learn the fundamentals"
  },
  { 
    id: 2, 
    title: "Advanced Techniques", 
    url: "/lesson/2", 
    icon: Target,
    description: "Master complex prompting"
  },
  { 
    id: 3, 
    title: "Subject-Specific Strategies", 
    url: "/lesson/3", 
    icon: GraduationCap,
    description: "Apply to your field"
  },
  { 
    id: 4, 
    title: "Assessment Creation", 
    url: "/lesson/4", 
    icon: FileCheck,
    description: "Build effective tests"
  },
  { 
    id: 5, 
    title: "Content Adaptation", 
    url: "/lesson/5", 
    icon: Lightbulb,
    description: "Customize for students"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-none"
      style={{
        background: 'linear-gradient(180deg, rgb(124, 58, 237) 0%, rgb(99, 102, 241) 100%)'
      }}
    >
      <SidebarContent className="px-6 py-8">
        <SidebarGroup>
          {!isCollapsed && (
            <h1 className="text-3xl font-bold text-white mb-8 drop-shadow-md">
              AI Prompting Course
            </h1>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {lessons.map((lesson) => (
                <SidebarMenuItem key={lesson.id}>
                  <SidebarMenuButton asChild tooltip={lesson.title} className="h-auto p-0">
                    <NavLink
                      to={lesson.url}
                      className={({ isActive }) =>
                        `block rounded-2xl p-6 transition-all duration-300 ${
                          isActive
                            ? "bg-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] transform"
                            : "bg-white/95 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white hover:shadow-[0_8px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                        }`
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, rgb(124, 58, 237) 0%, rgb(99, 102, 241) 100%)'
                          }}
                        >
                          <lesson.icon className="h-5 w-5" />
                        </div>
                        {!isCollapsed && (
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <span className="text-lg font-bold text-gray-900">
                              {lesson.title}
                            </span>
                            <span className="text-sm text-gray-600 leading-tight">
                              {lesson.description}
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
