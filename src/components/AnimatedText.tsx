import React, { useEffect, useState } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { easings } from '../lib/animations';

interface AnimatedTextProps {
    children: string;
    variant?: 'fadeIn' | 'slideIn' | 'typing' | 'wordByWord' | 'gradient';
    className?: string;
    delay?: number;
    gradient?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
    children,
    variant = 'fadeIn',
    className = '',
    delay = 0,
    gradient = false,
}) => {
    const controls = useAnimation();
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (variant === 'typing') {
            let currentIndex = 0;
            const intervalId = setInterval(() => {
                if (currentIndex <= children.length) {
                    setDisplayedText(children.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(intervalId);
                }
            }, 50);
            return () => clearInterval(intervalId);
        } else {
            controls.start('visible');
        }
    }, [children, variant, controls]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay,
            },
        },
    };

    const wordVariants: Variants = {
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

    const charVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: easings.smooth,
            },
        },
    };

    // Typing Effect
    if (variant === 'typing') {
        return (
            <span className={`${className} ${gradient ? 'gradient-text' : ''}`}>
                {displayedText}
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                    |
                </motion.span>
            </span>
        );
    }

    // Word by Word Animation
    if (variant === 'wordByWord') {
        const words = children.split(' ');
        return (
            <motion.span
                className={className}
                variants={containerVariants}
                initial="hidden"
                animate={controls}
            >
                {words.map((word, index) => (
                    <motion.span
                        key={index}
                        variants={wordVariants}
                        className={`inline-block mr-2 ${gradient ? 'gradient-text' : ''}`}
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.span>
        );
    }

    // Gradient Shimmer Effect
    if (variant === 'gradient' || gradient) {
        return (
            <motion.span
                className={`gradient-text ${className}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay,
                    duration: 0.8,
                    ease: easings.elegant,
                }}
            >
                {children}
            </motion.span>
        );
    }

    // Default Fade In
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay,
                duration: 0.6,
                ease: easings.elegant,
            }}
        >
            {children}
        </motion.span>
    );
};

export default AnimatedText;
