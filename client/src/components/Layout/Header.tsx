import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { GlassCard } from "@/components/ui/glassmorphism";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="fixed top-4 right-4 z-50 flex gap-2">
      <LanguageSelector />
      <ThemeToggle />
      {children}
    </header>
  );
}
