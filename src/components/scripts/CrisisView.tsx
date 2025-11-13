import type { Database } from "@/integrations/supabase/types";

type Script = Database["public"]["Tables"]["scripts"]["Row"];

interface CrisisViewProps {
  script: Script;
}

const PhaseCard = ({
  color,
  number,
  label,
  phrase,
  showPause = false,
  pauseDuration = "3-5 seconds",
}: {
  color: "violet" | "blue" | "emerald";
  number: number;
  label: string;
  phrase: string;
  showPause?: boolean;
  pauseDuration?: string;
}) => {
  const colorClasses = {
    violet: {
      bg: "bg-gradient-to-br from-violet-500/10 to-violet-600/10",
      border: "border-violet-500/20",
      badge: "bg-violet-500",
      text: "bg-gradient-to-r from-violet-600 to-purple-600",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
      border: "border-blue-500/20",
      badge: "bg-blue-500",
      text: "bg-gradient-to-r from-blue-600 to-cyan-600",
    },
    emerald: {
      bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/10",
      border: "border-emerald-500/20",
      badge: "bg-emerald-500",
      text: "bg-gradient-to-r from-emerald-600 to-teal-600",
    },
  };

  const colors = colorClasses[color];

  return (
    <>
      <div
        className={`${colors.bg} backdrop-blur-sm border ${colors.border} rounded-2xl p-6 mb-4`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`${colors.badge} text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg`}
          >
            {number}
          </div>
          <h3 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
            {label}
          </h3>
        </div>
        <p
          className={`text-2xl md:text-3xl font-bold leading-relaxed text-center p-6 ${colors.text} bg-clip-text text-transparent`}
        >
          "{phrase}"
        </p>
      </div>

      {showPause && (
        <div className="flex items-center justify-center gap-2 text-xl text-gray-400 text-center py-4 mb-4">
          <span className="text-2xl">⏱️</span>
          <span>Pause {pauseDuration}</span>
        </div>
      )}
    </>
  );
};

export const CrisisView = ({ script }: CrisisViewProps) => {
  return (
    <div className="space-y-2 py-4">
      <div className="text-center mb-6 pb-4 border-b border-red-500/20">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full border border-red-500/20">
          <span className="text-2xl">🚨</span>
          <span className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
            Crisis Mode Active
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-3 max-w-md mx-auto">
          Just the 3 phrases. Stay calm, use a soft tone, and pause between steps.
        </p>
      </div>

      <PhaseCard
        color="violet"
        number={1}
        label="CONNECTION"
        phrase={script.phrase_1}
        showPause={true}
        pauseDuration="3-5 seconds"
      />

      <PhaseCard
        color="blue"
        number={2}
        label="VALIDATION"
        phrase={script.phrase_2}
        showPause={true}
        pauseDuration="2-3 seconds"
      />

      <PhaseCard
        color="emerald"
        number={3}
        label="COMMAND"
        phrase={script.phrase_3}
        showPause={false}
      />

      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
        <p className="text-sm text-center text-amber-900 dark:text-amber-100 font-medium">
          💡 Remember: Connection before correction. Your calm is contagious.
        </p>
      </div>
    </div>
  );
};
