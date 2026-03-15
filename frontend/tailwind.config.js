/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        philly: {
          black:  '#050f0d',
          dark:   '#0d1a19',
          card:   '#112220',
          green:  '#004C54',
          neon:   '#00ff87',
          muted:  '#4d7a74',
          text:   '#e8f4f2',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
