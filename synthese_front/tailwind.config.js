/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← important !
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // ← adapte selon ton projet
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
