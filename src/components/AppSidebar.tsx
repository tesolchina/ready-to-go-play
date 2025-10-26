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
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold">
            AI Prompting Course
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {lessons.map((lesson) => (
                <SidebarMenuItem key={lesson.id}>
                  <SidebarMenuButton asChild tooltip={lesson.title}>
                    <NavLink
                      to={lesson.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-accent"
                      }
                    >
                      <lesson.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm">{lesson.title}</span>
                          <span className="text-xs text-muted-foreground">
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
