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
        // Secrets Shop Design System Colors
        primary: {
          DEFAULT: '#1a1a1a',
          light: '#333333',
          dark: '#000000',
        },
        secondary: {
          DEFAULT: '#f5f5f5',
          light: '#ffffff',
          dark: '#e0e0e0',
        },
        accent: {
          DEFAULT: '#ff6b6b',
          light: '#ff8787',
          dark: '#ff5252',
        },
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
