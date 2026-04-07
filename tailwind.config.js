/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff9800",
        secondary: "#ffd54f",
      },
      fontFamily: {
        sans: ['"Montserrat"', 'sans-serif'],
        serif: ['"Libre Baskerville"', 'serif'],
      }
    },
  },
  plugins: [],
}
