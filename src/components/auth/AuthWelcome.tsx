import { motion } from 'framer-motion';
import { AppShowcaseAnimation } from './AppShowcaseAnimation';

interface AuthWelcomeProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function AuthWelcome({ onGetStarted, onSignIn }: AuthWelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen w-full grid grid-rows-[1fr_auto]"
      style={{ background: '#0D0D0D' }}
    >
      {/* Language badge */}
      <div className="absolute top-6 right-6 z-10">
        <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-white text-sm font-medium">🇺🇸 EN</span>
        </div>
      </div>

      {/* Animation - pega espaço restante */}
      <div className="flex items-center justify-center px-6 pt-16">
        <AppShowcaseAnimation />
      </div>

      {/* Bottom content */}
      <div className="z-10 px-6 pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] space-y-6">
        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-2">
            Parenting strategies
          </h1>
          <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight">
            made simple
          </h1>
        </motion.div>

        {/* Get Started button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onGetStarted}
          className="
            w-full py-4 rounded-[30px]
            bg-white text-black
            text-lg font-semibold
            shadow-lg shadow-white/10
            active:scale-95 transition-transform
          "
        >
          Get Started
        </motion.button>

        {/* Sign In link */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={onSignIn}
            className="text-white/70 text-base hover:text-white transition-colors"
          >
            Already have an account?{' '}
            <span className="text-white font-semibold">Sign In</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
