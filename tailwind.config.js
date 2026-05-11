/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-bg': '#F2E9E9',
        'theme-accent': '#1D52A8',
      }
    },
  },
  plugins: [],
}
