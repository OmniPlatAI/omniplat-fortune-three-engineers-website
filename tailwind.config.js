/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#DC2626',
        'primary-blue': '#2563EB',
      },
    },
  },
  plugins: [],
}

