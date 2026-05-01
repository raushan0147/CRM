/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a5bcfc',
          400: '#8197f9',
          500: '#6472f3',
          600: '#4f54e8',
          700: '#4042ce',
          800: '#3637a6',
          900: '#303284',
          950: '#1e1f4d',
        },
        accent: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px -2px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(100, 114, 243, 0.3)',
      },
      backgroundImage: {
        'gradient-auth': 'linear-gradient(135deg, #1e1f4d 0%, #4042ce 50%, #6472f3 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
