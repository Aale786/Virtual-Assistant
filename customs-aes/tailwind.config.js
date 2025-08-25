/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/index.html"
  ],
  theme: {
    extend: {
      colors: {
        hold: '#ef4444',
        open: '#10b981',
        pending: '#f59e0b'
      }
    },
  },
  plugins: [],
}

