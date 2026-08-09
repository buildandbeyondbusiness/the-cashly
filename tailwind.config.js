/** @type {import('tailwindCSS').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#000000',
          card: '#1C1C1E',
          cardLight: '#F2F2F7',
          subCard: '#2C2C2E',
          emerald: '#10b981',
          emeraldLight: '#34d399',
          border: '#2C2C2E',
          borderLight: '#e5e7eb'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'spring-up': 'springUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
      },
      keyframes: {
        springUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
