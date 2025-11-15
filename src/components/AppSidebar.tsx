import { BookOpen, GraduationCap, Target, FileCheck, Lightbulb, MessageSquare, Home, Plus } from "lucide-react";
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

const tools = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    description: "Return to dashboard"
  },
  {
    title: "Create Lesson",
    url: "/lesson-creator",
    icon: Plus,
    description: "Build custom lessons"
  },
  {
    title: "Academic PhraseBank",
    url: "/academic-phrasebank",
    icon: MessageSquare,
    description: "AI writing assistant"
  },
];

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
          
          <SidebarGroupLabel className="text-white/90 text-xs uppercase tracking-wider mb-3">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent className="mb-6">
            <SidebarMenu className="gap-2">
              {tools.map((tool, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild tooltip={tool.title} className="h-auto p-0">
                    <NavLink
                      to={tool.url}
                      className={({ isActive }) =>
                        `block rounded-xl p-4 transition-all duration-300 ${
                          isActive
                            ? "bg-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] transform"
                            : "bg-white/95 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white hover:shadow-[0_8px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, rgb(124, 58, 237) 0%, rgb(99, 102, 241) 100%)'
                          }}
                        >
                          <tool.icon className="h-4 w-4" />
                        </div>
                        {!isCollapsed && (
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-semibold text-gray-900">
                              {tool.title}
                            </span>
                            <span className="text-xs text-gray-600">
                              {tool.description}
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

          <SidebarGroupLabel className="text-white/90 text-xs uppercase tracking-wider mb-3">
            Lessons
          </SidebarGroupLabel>
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
