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
          DEFAULT: '#07073b',
          dark: '#05052f',
          light: '#10104d',
        },
        secondary: {
          DEFAULT: '#1fb74d',
          dark: '#168a3d',
          light: '#67d681',
        },
        accent: {
          green: '#1fb74d',
          gold: '#e8a12f',
          charcoal: '#454546',
          muted: '#65647a',
          white: '#FFFFFF',
          black: '#000000',
          gray: {
            100: '#f3f4f6',
            200: '#f3f4f6',
            300: '#dfe2ea',
            400: '#dfe2ea',
            500: '#65647a',
            600: '#65647a',
            700: '#454546',
            800: '#454546',
            900: '#07073b',
          },
        },
      },
    },
    fontFamily: {
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
    },
  },
  plugins: [],
}
