/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        persian: ['Vazirmatn', 'sans-serif'],
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'pulse-once': 'pulse 0.6s ease-in-out',
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
