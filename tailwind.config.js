/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        biohazard: {
          yellow: '#c3f400',
          yellowHover: '#abd600',
          black: '#131313',
          dark: '#0e0e0e',
          container: '#1f1f1f',
          containerHigh: '#2a2a2a',
          containerHighest: '#353535',
          text: '#e2e2e2',
          textVariant: '#c4c9ac',
          border: '#444933',
          outline: '#8e9379',
          orange: '#ff5500',
          error: '#ffb4ab',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '0px',
      }
    },
  },
  plugins: [],
}
