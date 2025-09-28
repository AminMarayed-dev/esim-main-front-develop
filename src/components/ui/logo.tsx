import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <img
        src="/isim.svg"
        alt="Dariya Cell Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
