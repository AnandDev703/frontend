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
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAE0FF',
          300: '#7CC4FA',
          400: '#38A3F8',
          500: '#0F84EB',
          600: '#0267C7',
          700: '#0352A1',
          800: '#074684',
          900: '#0B192C',
          950: '#06101E',
        },
        navy: {
          800: '#132238',
          850: '#0F1C2E',
          900: '#0B1524',
          950: '#060B13',
        },
        risk: {
          low: {
            DEFAULT: '#10B981',
            bg: '#ECFDF5',
            darkBg: 'rgba(16, 185, 129, 0.15)',
            border: '#A7F3D0',
            text: '#065F46',
          },
          medium: {
            DEFAULT: '#F59E0B',
            bg: '#FFFBEB',
            darkBg: 'rgba(245, 158, 11, 0.15)',
            border: '#FDE68A',
            text: '#92400E',
          },
          high: {
            DEFAULT: '#EF4444',
            bg: '#FEF2F2',
            darkBg: 'rgba(239, 68, 68, 0.15)',
            border: '#FECACA',
            text: '#991B1B',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'glow-low': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-med': '0 0 20px rgba(245, 158, 11, 0.25)',
        'glow-high': '0 0 20px rgba(239, 68, 68, 0.25)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'pulse-slow': 'pulseGlow 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}
