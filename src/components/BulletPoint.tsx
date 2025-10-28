import { ReactNode } from "react";

interface BulletPointProps {
  icon: string;
  children: ReactNode;
}

export const BulletPoint = ({ icon, children }: BulletPointProps) => {
  return (
    <li className="relative bg-gradient-to-r from-accent to-card rounded-xl p-4 pl-12 border-l-4 border-primary shadow-sm hover:shadow-md transition-all duration-300">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
        {icon}
      </span>
      <span className="text-foreground leading-relaxed text-sm">{children}</span>
    </li>
  );
};
