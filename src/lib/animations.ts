// Animation Library - Zaha Hadid Inspired Motion Design
// Centralized animation utilities and Framer Motion variants

import { Variants } from 'framer-motion';

// === CUSTOM EASING CURVES ===
// Inspired by Zaha Hadid's fluid architectural curves

export const easings = {
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    swift: [0.25, 0.46, 0.45, 0.94],
    elegant: [0.33, 1, 0.68, 1],
    organic: [0.65, 0, 0.35, 1],
} as const;

// === ANIMATION VARIANTS ===

export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: easings.elegant,
        },
    },
};

export const fadeInScale: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: easings.smooth,
        },
    },
};

export const slideInFromLeft: Variants = {
    hidden: {
        opacity: 0,
        x: -50,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: easings.organic,
        },
    },
};

export const slideInFromRight: Variants = {
    hidden: {
        opacity: 0,
        x: 50,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: easings.organic,
        },
    },
};

export const scaleIn: Variants = {
    hidden: {
        scale: 0.8,
        opacity: 0,
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: easings.bounce,
        },
    },
};

// Stagger Children Animation
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: easings.elegant,
        },
    },
};

// === HOVER ANIMATIONS ===

export const hoverScale = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.3,
            ease: easings.smooth,
        },
    },
    tap: { scale: 0.98 },
};

export const hoverGlow = {
    rest: {
        boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
    },
    hover: {
        boxShadow: '0 0 40px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.3)',
        transition: {
            duration: 0.4,
            ease: easings.smooth,
        },
    },
};

export const hoverLift = {
    rest: {
        y: 0,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    hover: {
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: {
            duration: 0.3,
            ease: easings.swift,
        },
    },
};

// === MAGNETIC EFFECT ===

export const getMagneticEffect = (strength: number = 0.3) => {
    return {
        x: 0,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 150,
            damping: 15,
        },
    };
};

// Utility function for magnetic cursor following
export const calculateMagneticPosition = (
    mouseX: number,
    mouseY: number,
    elementRect: DOMRect,
    strength: number = 0.3
) => {
    const centerX = elementRect.left + elementRect.width / 2;
    const centerY = elementRect.top + elementRect.height / 2;

    const deltaX = (mouseX - centerX) * strength;
    const deltaY = (mouseY - centerY) * strength;

    return { x: deltaX, y: deltaY };
};

// === PAGE TRANSITION VARIANTS ===

export const pageTransition = {
    type: 'tween',
    ease: easings.elegant,
    duration: 0.5,
};

export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: pageTransition,
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: pageTransition,
    },
};

// === PARALLAX UTILITY ===

export const getParallaxY = (scrollY: number, speed: number = 0.5) => {
    return scrollY * speed;
};

// === RIPPLE EFFECT ===

export const createRipple = (
    event: React.MouseEvent<HTMLElement>,
    color: string = 'rgba(255, 255, 255, 0.5)'
): void => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = color;
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-effect 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
};

// Add global ripple animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes ripple-effect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(style);
}

// === SCROLL REVEAL HOOK ===

export const scrollRevealOptions = {
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '0px 0px -100px 0px',
};

// === ANIMATION ORCHESTRATION ===

export const orchestrateAnimations = {
    // For hero section
    hero: {
        title: { delay: 0.2 },
        subtitle: { delay: 0.4 },
        cta: { delay: 0.6 },
    },
    // For card grids
    cardGrid: (index: number) => ({
        delay: index * 0.1,
    }),
    // For lists
    listItem: (index: number) => ({
        delay: index * 0.05,
    }),
};
