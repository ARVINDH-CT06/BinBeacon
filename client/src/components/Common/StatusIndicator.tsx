import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  isAvailable: boolean;
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
}

export function StatusIndicator({ isAvailable, size = "md", showGlow = false }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn(
      "rounded-full border-2 border-background transition-all duration-300",
      sizeClasses[size],
      isAvailable 
        ? "bg-green-500" 
        : "bg-red-500",
      showGlow && (isAvailable 
        ? "animate-glow-green" 
        : "animate-glow-red")
    )} />
  );
}
