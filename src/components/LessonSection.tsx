import { ReactNode } from "react";

interface LessonSectionProps {
  title: string;
  children: ReactNode;
}

export const LessonSection = ({ title, children }: LessonSectionProps) => {
  return (
    <section className="bg-card rounded-2xl p-6 md:p-8 shadow-[var(--shadow-elevated)] animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 pb-4 border-b-4 border-primary">
        {title}
      </h2>
      {children}
    </section>
  );
};
