import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface FloatingCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    glowColor?: string;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
    children,
    className = '',
    intensity = 0.3,
    glowColor = 'rgba(6, 182, 212, 0.3)',
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Motion values for 3D tilt effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring animations for smooth transitions
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10 * intensity, -10 * intensity]), {
        stiffness: 200,
        damping: 20,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10 * intensity, 10 * intensity]), {
        stiffness: 200,
        damping: 20,
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const percentX = (e.clientX - centerX) / (rect.width / 2);
        const percentY = (e.clientY - centerY) / (rect.height / 2);

        mouseX.set(percentX);
        mouseY.set(percentY);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            className={`glass-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            animate={{
                boxShadow: isHovered
                    ? `0 20px 40px -12px rgba(0, 0, 0, 0.3), 0 0 40px ${glowColor}`
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
            transition={{
                boxShadow: { duration: 0.3 },
            }}
        >
            {/* Inner glow effect */}
            <motion.div
                className="absolute inset-0 rounded-[inherit] opacity-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`,
                }}
                animate={{
                    opacity: isHovered ? 0.6 : 0,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Content with depth */}
            <div
                style={{
                    transform: 'translateZ(20px)',
                    transformStyle: 'preserve-3d',
                }}
            >
                {children}
            </div>
        </motion.div>
    );
};

export default FloatingCard;
