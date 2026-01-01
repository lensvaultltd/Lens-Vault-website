import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createRipple, easings } from '../lib/animations';

interface PremiumButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    magnetic?: boolean;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    magnetic = true,
    className = '',
    disabled = false,
    loading = false,
    type = 'button',
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [magneticPosition, setMagneticPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!magnetic || disabled || !buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.2;
        const deltaY = (e.clientY - centerY) * 0.2;

        setMagneticPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
        setMagneticPosition({ x: 0, y: 0 });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !loading) {
            createRipple(e);
            onClick?.(e);
        }
    };

    const variants = {
        primary: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50',
        secondary: 'bg-white/10 backdrop-blur-xl text-white font-semibold border border-white/20 hover:bg-white/20 hover:border-white/30',
        ghost: 'bg-transparent text-white font-medium hover:bg-white/10',
    };

    const sizes = {
        sm: 'px-6 py-2 text-sm',
        md: 'px-8 py-3 text-base',
        lg: 'px-10 py-4 text-lg',
    };

    return (
        <motion.button
            ref={buttonRef}
            type={type}
            className={`
        relative overflow-hidden rounded-full
        transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            disabled={disabled || loading}
            animate={{
                x: magneticPosition.x,
                y: magneticPosition.y,
            }}
            whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
            }}
        >
            {/* Shimmer Effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: 'linear',
                }}
            />

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                    <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                )}
                {children}
            </span>
        </motion.button>
    );
};

export default PremiumButton;
