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
    <Sidebar collapsible="icon" className="border-r bg-gradient-to-b from-background to-accent/20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold px-4 py-3 bg-primary/5 rounded-lg mx-2 mb-2">
            AI Prompting Course
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {lessons.map((lesson) => (
                <SidebarMenuItem key={lesson.id}>
                  <SidebarMenuButton asChild tooltip={lesson.title}>
                    <NavLink
                      to={lesson.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-lg"
                          : "hover:bg-gradient-to-r hover:from-accent hover:to-accent/80 hover:text-accent-foreground transition-all duration-200 rounded-lg hover:shadow-sm"
                      }
                    >
                      <lesson.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">{lesson.title}</span>
                          <span className="text-xs opacity-80 truncate">
                            {lesson.description}
                          </span>
                        </div>
                      )}
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
