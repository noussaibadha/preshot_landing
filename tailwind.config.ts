import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#0a0a0a',
        'surface-2': '#111111',
        violet: {
          DEFAULT: '#682db4',
          light: '#8b3cf0',
          dark: '#4e2189',
        },
        blue: {
          accent: '#3e74ff',
        },
        'icon-bg': '#3642bb',
        muted: '#818181',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #682db4 0%, #3e74ff 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(104,45,180,0.15) 0%, rgba(62,116,255,0.15) 100%)',
        'gradient-text': 'linear-gradient(90deg, #8b3cf0 0%, #3e74ff 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
