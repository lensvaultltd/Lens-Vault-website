/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                forest: {
                    900: '#020408',
                    800: '#0F172A',
                    700: '#1E293B',
                    600: '#334155',
                    500: '#475569',
                    400: '#94A3B8',
                    300: '#CBD5E1',
                    200: '#E2E8F0',
                    100: '#F1F5F9',
                    50: '#F8FAFC',
                    accent: '#0EA5E9',
                    accentHover: '#0284C7',
                },
                // Premium Accent Palette
                premium: {
                    cyan: '#06b6d4',
                    sky: '#0ea5e9',
                    blue: '#3b82f6',
                    indigo: '#6366f1',
                    purple: '#8b5cf6',
                    fuchsia: '#d946ef',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'sans-serif'],
                display: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'fade-in-up': 'fadeInUp 0.8s ease-out',
                'slide-in-left': 'slideInLeft 0.6s ease-out',
                'slide-in-right': 'slideInRight 0.6s ease-out',
                'scale-in': 'scaleIn 0.5s ease-out',
                'shimmer': 'shimmer 3s linear infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'gradient-x': 'gradientX 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-50px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(50px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.3)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                gradientX: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-mesh': `
                    radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.2) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                    radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
                    radial-gradient(at 0% 100%, rgba(14, 165, 233, 0.1) 0px, transparent 50%)
                `,
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.15)',
                'glow-strong': '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.25)',
                'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
            },
            borderRadius: {
                'organic-1': '63% 37% 54% 46% / 55% 48% 52% 45%',
                'organic-2': '30% 70% 70% 30% / 30% 30% 70% 70%',
                'organic-3': '38% 62% 63% 37% / 70% 33% 67% 30%',
            },
        },
    },
    plugins: [],
}
