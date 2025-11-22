import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassmorphismProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Glassmorphism({ children, className, onClick }: GlassmorphismProps) {
  return (
    <div 
      className={cn("glassmorphism", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function GlassCard({ children, className, onClick }: GlassmorphismProps) {
  return (
    <div 
      className={cn("glass-card p-6", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
