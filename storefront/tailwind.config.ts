import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E91E8C',
          light: '#FFF0F7',
          dark: '#D1157A',
        },
        background: {
          DEFAULT: '#FFFFFF',
          light: '#F5F5F5',
        },
        text: {
          DEFAULT: '#1a1a1a',
          secondary: '#666666',
        },
        border: {
          DEFAULT: '#E0E0E0',
        },
        'luxury-gray': '#666666',
        'luxury-border': '#E0E0E0',
        'luxury-dark': '#1a1a1a',
        'luxury-background': '#F9F9F9',
        'accent-gold': '#D4AF37',
        'accent-error': '#F44336',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        luxury: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'luxury': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
export default config
