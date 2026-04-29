export const SILK = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: SILK },
  },
};

export const stagger = (delay = 0.08) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: delay, delayChildren: 0.05 },
  },
});

export const fadeOnly = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: SILK } },
};
