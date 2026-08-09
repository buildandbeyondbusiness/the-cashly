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
        cashly: {
          dark: '#0e0826',
          surface: '#170e38',
          cardDark: '#1e1346',
          purple: '#6c3ce9',
          purpleLight: '#8b5cf6',
          purpleGlow: 'rgba(108, 60, 233, 0.25)',
          orange: '#ff7a45',
          green: '#10b981',
          red: '#f43f5e',
          blue: '#3b82f6',
          bgLight: '#f3f4f9',
          cardLight: '#ffffff',
          textDark: '#0f172a',
          textMuted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'purple-glow': '0 10px 25px -5px rgba(108, 60, 233, 0.4)',
        'orange-glow': '0 10px 25px -5px rgba(255, 122, 69, 0.4)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
