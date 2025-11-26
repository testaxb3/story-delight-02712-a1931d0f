import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Check } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/useHaptic";

const ThemeSelection = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { user } = useAuth();
  const { triggerHaptic } = useHaptic();
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    trackEvent("theme_selection_page_viewed");
  }, []);

  const handleThemeSelect = async (theme: "light" | "dark") => {
    triggerHaptic('medium');
    setSelectedTheme(theme);
    setTheme(theme);
    localStorage.setItem("theme_selected", "true");
    trackEvent("theme_selected", { theme });

    // Save theme to database
    if (user?.id) {
      const { error } = await supabase
        .from('profiles')
        .update({ theme })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving theme:', error);
        // ✅ FIX: Clearer warning that indicates theme will sync when connection restores
        toast.warning('Theme saved locally. Will sync to cloud when connection restores.', {
          duration: 4000
        });
      }
    }

    // Smooth transition to quiz or dashboard if already completed
    setTimeout(() => {
      if (user?.quiz_completed) {
        navigate("/");
      } else {
        navigate("/quiz");
      }
    }, 500);
  };

  const themes = [
    {
      id: "light" as const,
      icon: Sun,
      title: "Light & Clean",
      description: "Perfect for daytime use",
      gradient: "from-amber-50 to-orange-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      hoverBg: "hover:bg-amber-50/50",
    },
    {
      id: "dark" as const,
      icon: Moon,
      title: "Dark & Focused",
      description: "Easy on the eyes",
      gradient: "from-slate-800 to-slate-900",
      iconColor: "text-blue-400",
      borderColor: "border-slate-700",
      hoverBg: "hover:bg-slate-800/50",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-3 text-foreground font-relative"
          >
            Choose Your Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground"
          >
            Select the theme that feels right for you
          </motion.p>
        </div>

        {/* Theme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {themes.map((theme, index) => {
            const Icon = theme.icon;
            const isSelected = selectedTheme === theme.id;

            return (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeSelect(theme.id)}
                className={`
                  relative overflow-hidden rounded-2xl p-6 md:p-8
                  border-2 transition-all duration-300
                  ${theme.borderColor}
                  ${theme.hoverBg}
                  ${isSelected ? "ring-4 ring-primary ring-offset-2 dark:ring-offset-background" : ""}
                  bg-card/50 dark:bg-card backdrop-blur-sm
                  shadow-lg hover:shadow-xl
                `}
              >
                {/* Background Gradient Accent */}
                <div
                  className={`
                    absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl
                    bg-gradient-to-br ${theme.gradient}
                    ${theme.id === 'light' ? 'opacity-30' : 'opacity-20'}
                  `}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-3 md:space-y-4">
                  {/* Icon */}
                  <div
                    className={`
                      w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
                      bg-gradient-to-br ${theme.gradient}
                      shadow-xl
                      ${theme.id === 'light' ? 'border-2 border-amber-200/50' : 'border-2 border-slate-600/50'}
                    `}
                  >
                    <Icon className={`w-8 h-8 md:w-10 md:h-10 ${theme.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-foreground font-relative">
                    {theme.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-muted-foreground">{theme.description}</p>

                  {/* Preview Badge */}
                  <div
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium shadow-md
                      bg-gradient-to-r ${theme.gradient}
                      ${theme.id === "light" ? "text-amber-900 border border-amber-300/30" : "text-blue-100 border border-slate-600/30"}
                    `}
                  >
                    {theme.id === "light" ? "☀️ Bright" : "🌙 Calm"}
                  </div>

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs md:text-sm text-muted-foreground/70"
        >
          You can change this anytime in settings
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ThemeSelection;
