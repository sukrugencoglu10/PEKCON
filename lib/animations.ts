import { Variants } from "framer-motion";

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

// Slide up animation
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Slide down animation
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Scale in animation
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Card hover animation
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Advanced floating animations with sine wave motion
export const floatComplex: Variants = {
  animate: {
    y: [0, -15, 0],
    x: [0, 10, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: [0.45, 0.05, 0.55, 0.95], // Custom cubic-bezier for organic feel
    },
  },
};

export const floatSlow: Variants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 3, -3, 0],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1], // Smooth sine-like curve
    },
  },
};

export const floatFast: Variants = {
  animate: {
    y: [0, -10, 0],
    x: [0, -8, 0],
    rotate: [0, -4, 4, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: [0.45, 0.05, 0.55, 0.95],
    },
  },
};

// Anti-gravity scroll-triggered animation
export const antiGravityFloat: Variants = {
  animate: {
    y: [0, -25, 0],
    opacity: [0.3, 0.5, 0.3],
    scale: [1, 1.05, 1],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};
// Flag waving animation
export const flagWave: Variants = {
  animate: {
    skewY: [0, -2, 2, 0],
    skewX: [0, 1, -1, 0],
    rotateZ: [0, 1, -1, 0],
    scale: [1, 1.01, 0.99, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
