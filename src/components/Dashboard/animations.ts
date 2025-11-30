// Dashboard Animation Constants - Apple's signature feel

export const SPRING = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  bouncy: { type: "spring", stiffness: 300, damping: 20, mass: 0.8 },
} as const;

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING.gentle,
  },
};
