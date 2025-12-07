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
        "relative flex items-center gap-1 rounded-full border border-border/20 bg-card/90 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl dark:border-white/5 dark:bg-card/80 dark:shadow-[0_12px_40px_rgba(0,0,0,0.8)]",
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
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-2xl px-3 py-2 text-xs transition-colors duration-200 min-w-[56px]",
              isSelected
                ? activeColor
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Sliding indicator background */}
            {isSelected && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 rounded-2xl bg-primary/12 dark:bg-primary/20"
                transition={springTransition}
              />
            )}

            {/* Icon */}
            <motion.div
              className="relative z-10"
              animate={{
                scale: isSelected ? 1.1 : 1,
              }}
              transition={springTransition}
            >
              <Icon size={22} strokeWidth={isSelected ? 2.5 : 2} />
            </motion.div>

            {/* Always visible label */}
            <span
              className={cn(
                "relative z-10 mt-1 whitespace-nowrap transition-all duration-200",
                isSelected ? "font-semibold" : "font-normal text-[11px]"
              )}
            >
              {tab.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
