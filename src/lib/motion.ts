import type { Variants } from 'framer-motion'

export const motionEase = [0.22, 1, 0.36, 1] as const
export const motionEaseExit = [0.4, 0, 1, 1] as const
export const motionSpring = {
  type: 'spring',
  stiffness: 320,
  damping: 26,
  mass: 0.9,
} as const

export const cinemaSpring = {
  type: 'spring',
  stiffness: 240,
  damping: 20,
  mass: 0.88,
} as const

export const fastCardSpring = {
  type: 'spring',
  stiffness: 380,
  damping: 28,
  mass: 0.72,
} as const

type RouteStageCustom = {
  fromPath?: string
  toPath?: string
}

type PrologueParallaxCustom = {
  delay?: number
  depth?: number
}

export const routeStageVariants: Variants = {
  initial: (custom?: RouteStageCustom) => {
    const isPrologueHandOff = custom?.fromPath === '/prologue' && custom?.toPath === '/'
    return {
      opacity: 0.001,
      y: isPrologueHandOff ? 8 : 10,
      scale: isPrologueHandOff ? 0.996 : 0.998,
      filter: isPrologueHandOff ? 'blur(8px)' : 'blur(4px)',
      rotateX: isPrologueHandOff ? -2 : 0,
      transformPerspective: isPrologueHandOff ? 1800 : 0,
    }
  },
  animate: (custom?: RouteStageCustom) => {
    const isPrologueHandOff = custom?.fromPath === '/prologue' && custom?.toPath === '/'
    return {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      rotateX: 0,
      transition: {
        duration: isPrologueHandOff ? 0.42 : 0.28,
        ease: motionEase,
        filter: { duration: isPrologueHandOff ? 0.6 : 0.2, ease: motionEase },
      },
      transitionEnd: {
        transform: 'none',
        filter: 'none',
      },
    }
  },
  exit: (custom?: RouteStageCustom) => {
    const isPrologueHandOff = custom?.fromPath === '/prologue' && custom?.toPath === '/'
    return {
      opacity: 0,
      y: isPrologueHandOff ? -4 : -6,
      scale: isPrologueHandOff ? 1.004 : 0.999,
      filter: isPrologueHandOff ? 'blur(6px)' : 'blur(2px)',
      transition: {
        duration: isPrologueHandOff ? 0.18 : 0.14,
        ease: motionEaseExit,
      },
    }
  },
}

export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: motionEase,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: motionEaseExit,
    },
  },
}

export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.94,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...motionSpring,
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.96,
    transition: {
      duration: 0.18,
      ease: motionEaseExit,
    },
  },
}

export const drawerVariants: Variants = {
  initial: {
    opacity: 0,
    x: 44,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      ...motionSpring,
    },
  },
  exit: {
    opacity: 0,
    x: 30,
    scale: 0.992,
    transition: {
      duration: 0.2,
      ease: motionEaseExit,
    },
  },
}

export const dropdownVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.18,
      ease: motionEase,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.97,
    transition: {
      duration: 0.14,
      ease: motionEaseExit,
    },
  },
}

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
  exit: {},
}

export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0.001,
    y: 12,
    scale: 0.992,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: motionEase,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.992,
    transition: {
      duration: 0.14,
      ease: motionEaseExit,
    },
  },
}

export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.92,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: motionEase,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.94,
    transition: {
      duration: 0.14,
      ease: motionEaseExit,
    },
  },
}

export const hoverLift = {
  scale: 1.01,
  y: -1.5,
  transition: {
    duration: 0.24,
    ease: motionEase,
  },
}

export const tapPress = {
  scale: 0.988,
  y: -1,
  transition: {
    duration: 0.14,
    ease: motionEase,
  },
}

export const cardHoverLift = {
  y: -4,
  scale: 1.012,
  transition: {
    duration: 0.28,
    ease: motionEase,
  },
}

export const cardPress = {
  scale: 0.986,
  y: -1,
  transition: {
    duration: 0.14,
    ease: motionEase,
  },
}

export const aliveCardHover = {
  y: -5,
  scale: 1.012,
  rotateX: 0,
  rotateY: 0,
  transition: {
    duration: 0.18,
    ease: motionEase,
  },
}

export const aliveCardTap = {
  scale: 0.984,
  y: -1,
  rotateX: 0,
  rotateY: 0,
  transition: {
    duration: 0.1,
    ease: motionEase,
  },
}

export const buttonMagnetHover = {
  y: -2,
  scale: 1.012,
  transition: {
    duration: 0.18,
    ease: motionEase,
  },
}

export const pageSectionVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
}

export const cinemaSectionVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
}

export const cardPopVariants: Variants = {
  initial: {
    opacity: 0.001,
    y: 16,
    scale: 0.975,
    rotateX: 0,
    rotateY: 0,
    z: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    z: 0,
    transition: {
      duration: 0.26,
      ease: motionEase,
    },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.988,
    rotateX: 0,
    transition: {
      duration: 0.14,
      ease: motionEaseExit,
    },
  },
}

export const cardPopChildVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.992,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: motionEase,
      delay: 0.02,
    },
  },
}

export const fastCardRevealVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: motionEase,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.985,
    transition: {
      duration: 0.14,
      ease: motionEaseExit,
    },
  },
}

export const viewportCardRevealVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.982,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: motionEase,
    },
  },
}

export const cardHoverQuick = {
  y: -4,
  scale: 1.012,
  transition: {
    duration: 0.18,
    ease: motionEase,
  },
}

export const cardPressQuick = {
  y: -1,
  scale: 0.986,
  transition: {
    duration: 0.1,
    ease: motionEase,
  },
}

export const directionalCardEntry = {
  northwest: {
    opacity: 0,
    x: -96,
    y: -56,
    scale: 0.94,
  },
  northeast: {
    opacity: 0,
    x: 96,
    y: -56,
    scale: 0.94,
  },
  southwest: {
    opacity: 0,
    x: -96,
    y: 56,
    scale: 0.94,
  },
  southeast: {
    opacity: 0,
    x: 96,
    y: 56,
    scale: 0.94,
  },
} as const

export const directionalCardAnimate = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
}

export const directionalCardTransition = {
  ...fastCardSpring,
}

export const prologueSceneVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 1.06,
    y: 28,
    rotateX: -4,
    filter: 'blur(18px)',
    transformPerspective: 2400,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.28,
      ease: motionEase,
      opacity: { duration: 0.6, ease: motionEase },
      filter: { duration: 0.9, ease: motionEase },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -18,
    rotateX: 3,
    filter: 'blur(14px)',
    transition: {
      duration: 0.42,
      ease: motionEaseExit,
      opacity: { duration: 0.28, ease: motionEaseExit },
    },
  },
}

export const prologueCopyVariants: Variants = {
  initial: {
    opacity: 0,
    y: 22,
    filter: 'blur(10px)',
    rotateX: -6,
    transformPerspective: 1800,
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: {
      duration: 0.88,
      ease: motionEase,
      staggerChildren: 0.12,
      delayChildren: 0.18,
      filter: { duration: 0.7, ease: motionEase },
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(8px)',
    transition: {
      duration: 0.26,
      ease: motionEaseExit,
    },
  },
}

export const prologueTitleLineVariants: Variants = {
  initial: {
    opacity: 0,
    y: 48,
    rotateX: -22,
    transformOrigin: '50% 100%',
    filter: 'blur(6px)',
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.02,
      delay: 0.22 + index * 0.14,
      ease: motionEase,
      filter: { duration: 0.6, delay: 0.22 + index * 0.14, ease: motionEase },
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    y: -16,
    filter: 'blur(4px)',
    transition: {
      duration: 0.22,
      delay: index * 0.04,
      ease: motionEaseExit,
    },
  }),
}

export const prologueBackgroundVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.94,
    filter: 'blur(14px)',
  },
  animate: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.24,
      delay,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(16px)',
    transition: {
      duration: 0.28,
      ease: motionEaseExit,
    },
  },
}

export const prologueMidgroundVariants: Variants = {
  initial: {
    opacity: 0,
    y: 22,
    scale: 0.97,
    filter: 'blur(10px)',
  },
  animate: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.96,
      delay,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.99,
    transition: {
      duration: 0.24,
      ease: motionEaseExit,
    },
  },
}

export const prologueForegroundVariants: Variants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.95,
    filter: 'blur(10px)',
  },
  animate: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      delay,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.99,
    transition: {
      duration: 0.2,
      ease: motionEaseExit,
    },
  },
}

export const prologueLineDrawVariants: Variants = {
  initial: {
    opacity: 0,
    scaleY: 0,
    transformOrigin: '50% 0%',
  },
  animate: (delay = 0) => ({
    opacity: 1,
    scaleY: 1,
    transition: {
      opacity: {
        duration: 0.24,
        delay,
        ease: motionEase,
      },
      scaleY: {
        duration: 0.62,
        delay,
        ease: motionEase,
      },
    },
  }),
  exit: {
    opacity: 0,
    scaleY: 0.2,
    transition: {
      duration: 0.22,
      ease: motionEaseExit,
    },
  },
}

export const prologueNodeVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.82,
    y: 10,
    filter: 'blur(8px)',
  },
  animate: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.58,
      delay,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.18,
      ease: motionEaseExit,
    },
  },
}

export const prologueHomeRevealVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.965,
    y: 18,
    rotateX: -6,
    transformOrigin: '50% 100%',
    filter: 'blur(10px)',
  },
  animate: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.02,
      delay,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    scale: 1.01,
    y: -12,
    transition: {
      duration: 0.22,
      ease: motionEaseExit,
    },
  },
}

export const prologueCameraVariants: Variants = {
  initial: {
    opacity: 0.001,
    scale: 1.06,
    y: 20,
    rotateX: -5,
    filter: 'blur(18px)',
    transformPerspective: 2200,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.38,
      ease: motionEase,
      filter: { duration: 1, ease: motionEase },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: -16,
    rotateX: 4,
    filter: 'blur(14px)',
    transition: {
      duration: 0.32,
      ease: motionEaseExit,
      opacity: { duration: 0.22, ease: motionEaseExit },
    },
  },
}

export const prologueParallaxVariants: Variants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.96,
    filter: 'blur(12px)',
  },
  animate: (custom?: PrologueParallaxCustom) => ({
    opacity: 1,
    y: custom?.depth ?? 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.08,
      delay: custom?.delay ?? 0,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.992,
    filter: 'blur(8px)',
    transition: {
      duration: 0.22,
      ease: motionEaseExit,
    },
  },
}

export const prologueOrnamentRevealVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.92,
    rotate: -2,
    filter: 'blur(12px)',
  },
  animate: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.02,
      delay,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.94,
    filter: 'blur(8px)',
    transition: {
      duration: 0.18,
      ease: motionEaseExit,
    },
  },
}

export const prologueTrailRevealVariants: Variants = {
  initial: {
    opacity: 0,
    scaleX: 0,
    transformOrigin: '0% 50%',
    filter: 'blur(6px)',
  },
  animate: (delay = 0) => ({
    opacity: 1,
    scaleX: 1,
    filter: 'blur(0px)',
    transition: {
      opacity: {
        duration: 0.3,
        delay,
        ease: motionEase,
      },
      scaleX: {
        duration: 0.96,
        delay,
        ease: motionEase,
      },
    },
  }),
  exit: {
    opacity: 0,
    scaleX: 0.18,
    transition: {
      duration: 0.18,
      ease: motionEaseExit,
    },
  },
}

export const prologueFinalLockVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 22,
    rotateX: -8,
    filter: 'blur(12px)',
    transformPerspective: 1800,
  },
  animate: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.18,
      delay,
      ease: motionEase,
    },
  }),
  exit: {
    opacity: 0,
    scale: 1.006,
    y: -8,
    filter: 'blur(8px)',
    transition: {
      duration: 0.22,
      ease: motionEaseExit,
    },
  },
}
