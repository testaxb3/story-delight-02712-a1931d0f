import { useTheme } from "@/contexts/ThemeContext";
import logoDark from "@/assets/logo-brainy-dark.svg";
import logoLight from "@/assets/logo-brainy-light.svg";

interface LogoProps {
  className?: string;
  alt?: string;
}

export function Logo({ className = "h-8 w-auto", alt = "Brainy+" }: LogoProps) {
  const { theme } = useTheme();

  return (
    <img
      src={theme === "dark" ? logoDark : logoLight}
      alt={alt}
      className={className}
    />
  );
}
