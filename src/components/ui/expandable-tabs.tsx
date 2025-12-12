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
  stiffness: 500,
  damping: 30,
  mass: 0.6,
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
    <div className="mx-1 h-[24px] w-[1.2px] bg-[#E8E8E6]" aria-hidden="true" />
  );

  return (
    <div
      className={cn(
        "relative flex items-center gap-1 rounded-full border border-[#F0E6DF] bg-white/95 p-2 shadow-xl shadow-black/10 backdrop-blur-xl",
        className
      )}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] opacity-40" />

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
              "relative flex flex-col items-center justify-center rounded-2xl px-4 py-2 text-xs transition-colors duration-200 min-w-[60px]",
              isSelected
                ? "text-[#FF6631]"
                : "text-[#8D8D8D] hover:text-[#393939]"
            )}
          >
            {/* Active background with gradient */}
            {isSelected && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6631]/15 to-[#FFA300]/10"
                transition={springTransition}
              />
            )}

            {/* Glow effect for active tab */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6631]/20 to-[#FFA300]/15 blur-md -z-10"
              />
            )}

            {/* Icon with animation */}
            <motion.div
              className="relative z-10"
              animate={{
                scale: isSelected ? 1.15 : 1,
                y: isSelected ? -1 : 0,
              }}
              transition={springTransition}
            >
              <Icon
                size={22}
                strokeWidth={isSelected ? 2.5 : 1.8}
                className={cn(
                  "transition-all duration-200",
                  isSelected && "drop-shadow-[0_0_6px_rgba(255,102,49,0.4)]"
                )}
              />
            </motion.div>

            {/* Label */}
            <motion.span
              className={cn(
                "relative z-10 mt-1 whitespace-nowrap transition-all duration-200",
                isSelected
                  ? "font-bold text-[11px]"
                  : "font-medium text-[10px]"
              )}
              animate={{
                y: isSelected ? 0 : 1,
              }}
            >
              {tab.title}
            </motion.span>

            {/* Active indicator dot */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={springTransition}
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300]"
                />
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
