    /** @type {import('tailwindcss').Config} */
    export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
        colors: {
            'signal-red': '#e9133d',
            'signal-yellow': '#f0dd09',
            'signal-green': '#04f781',
            'dark-bg': '#0a0a0a',
            'card-bg': 'rgba(255, 255, 255, 0.05)'
        },
        animation: {
            'glow-red': 'glowRed 1s ease-in-out infinite alternate',
            'glow-yellow': 'glowYellow 1s ease-in-out infinite alternate',
            'glow-green': 'glowGreen 1s ease-in-out infinite alternate',
            'pulse-slow': 'pulse 2s ease-in-out infinite',
        },
        keyframes: {
            glowRed: {
            '0%': { boxShadow: '0 0 20px #ff1744, 0 0 40px #ff1744, 0 0 60px #ff1744' },
            '100%': { boxShadow: '0 0 30px #ff1744, 0 0 60px #ff1744, 0 0 90px #ff1744' }
            },
            glowYellow: {
            '0%': { boxShadow: '0 0 20px #ffea00, 0 0 40px #ffea00, 0 0 60px #ffea00' },
            '100%': { boxShadow: '0 0 30px #ffea00, 0 0 60px #ffea00, 0 0 90px #ffea00' }
            },
            glowGreen: {
            '0%': { boxShadow: '0 0 20px #00e676, 0 0 40px #00e676, 0 0 60px #00e676' },
            '100%': { boxShadow: '0 0 30px #00e676, 0 0 60px #00e676, 0 0 90px #00e676' }
            }
        }
        },
    },
    plugins: [],
    }