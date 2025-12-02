import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Tab {
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  selected?: number | null;
  onChange?: (index: number | null) => void;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 28,
  mass: 0.8,
};

const labelTransition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

function isSeparator(tab: TabItem): tab is Separator {
  return tab.type === "separator";
}

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  selected: controlledSelected,
  onChange,
}: ExpandableTabsProps) {
  const [internalSelected, setInternalSelected] = React.useState<number | null>(null);
  
  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : internalSelected;

  const handleSelect = (index: number) => {
    if (!isControlled) {
      setInternalSelected(index);
    }
    onChange?.(index);
  };

  const SeparatorElement = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  return (
    <div
      className={cn(
        "relative flex items-center gap-1 rounded-full border border-white/10 bg-card/70 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:border-white/5 dark:bg-card/80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (isSeparator(tab)) {
          return <SeparatorElement key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        const isSelected = selected === index;

        return (
          <motion.button
            key={tab.title}
            onClick={() => handleSelect(index)}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "relative flex items-center justify-center rounded-full px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              isSelected
                ? activeColor
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Sliding indicator background */}
            {isSelected && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 rounded-full bg-primary/12 dark:bg-primary/20"
                transition={springTransition}
                style={{
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              />
            )}

            {/* Glow effect for selected */}
            {isSelected && (
              <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 rounded-full opacity-50"
                transition={springTransition}
                style={{
                  background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
                }}
              />
            )}

            {/* Icon with animation */}
            <motion.div
              className="relative z-10"
              animate={{
                scale: isSelected ? 1.1 : 1,
                rotate: isSelected ? [0, -8, 0] : 0,
              }}
              transition={{
                scale: springTransition,
                rotate: { duration: 0.4, ease: "easeOut" },
              }}
            >
              <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
            </motion.div>

            {/* Expanding label */}
            <AnimatePresence mode="popLayout">
              {isSelected && (
                <motion.span
                  initial={{ width: 0, opacity: 0, x: -8 }}
                  animate={{ width: "auto", opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: -8 }}
                  transition={labelTransition}
                  className="relative z-10 ml-2 overflow-hidden whitespace-nowrap font-semibold"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
