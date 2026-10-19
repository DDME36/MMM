/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F3EDE2',
          300: '#E8DDCB',
        },
        blush: {
          50: '#FFF5F3',
          100: '#FEE8E2',
          200: '#FDCAC0',
          500: '#FF7E67',
          600: '#E85D75',
          700: '#C93B55',
        },
        obsidian: {
          900: '#0F0E17',
          800: '#1B1926',
          700: '#2A273A',
        },
      },
      fontFamily: {
        mali: ['Mali', 'cursive', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
        krungthep: ['FCKrungThep-Black', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(232, 93, 117, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'glass-hover': '0 16px 40px 0 rgba(232, 93, 117, 0.16), 0 4px 12px 0 rgba(0, 0, 0, 0.06)',
        'card-3d': '0 20px 40px -15px rgba(0,0,0,0.07), 0 0 0 1px rgba(255,255,255,0.8) inset',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
