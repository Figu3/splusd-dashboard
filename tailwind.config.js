/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plasma: {
          dark: '#0a0b0d',
          darker: '#05060 7',
          card: '#141518',
          border: '#1f2023',
          accent: '#3b82f6',
          hover: '#1a1b1e',
        }
      }
    },
  },
  plugins: [],
}
