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
        // Secrets Shop Design System - Exact Colors
        primary: {
          DEFAULT: '#E91E8C', // Magenta/Hot Pink
          light: '#FFF0F7',   // Light magenta background
          dark: '#D1157A',    // Darker magenta for hover
        },
        'text': {
          DEFAULT: '#1a1a1a', // Dark Navy/Black for text
          secondary: '#666666', // Dark gray for secondary text
        },
        'background': {
          DEFAULT: '#FFFFFF', // White primary background
          light: '#F5F5F5',   // Light gray secondary background
        },
        'border': {
          DEFAULT: '#E0E0E0', // Medium gray for borders
        },
        // Status colors from design system
        success: '#7FD856',   // Lime Green
        warning: '#FF9800',   // Orange
        error: '#F44336',     // Red
        info: '#00BCD4',      // Teal/Turquoise
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
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
