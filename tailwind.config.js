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
                    900: '#020408', // Ultra Dark Background (Almost Black)
                    800: '#0F172A', // Dark Slate
                    700: '#1E293B',
                    600: '#334155',
                    500: '#475569',
                    400: '#94A3B8',
                    300: '#CBD5E1', // Text
                    200: '#E2E8F0',
                    100: '#F1F5F9',
                    50: '#F8FAFC',
                    accent: '#0EA5E9', // Sky Blue (Cybersecurity)
                    accentHover: '#0284C7',
                }
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
