/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#c9a84c',
        cream: '#f5f0e8',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
}