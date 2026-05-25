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
          DEFAULT: '#238A55',
          dark: '#196B43',
          light: '#7CC99C',
        },
        accent: {
          green: '#238A55',
          gold: '#C58A2A',
          charcoal: '#303840',
          muted: '#5F6B76',
          white: '#FFFFFF',
          black: '#000000',
          gray: {
            100: '#F4F5F6',
            200: '#F4F5F6',
            300: '#D7DCE1',
            400: '#D7DCE1',
            500: '#5F6B76',
            600: '#5F6B76',
            700: '#303840',
            800: '#303840',
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
