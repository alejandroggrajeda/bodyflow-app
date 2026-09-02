/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        card: '#18181b',
        primary: {
          DEFAULT: '#10b981',
          hover: '#059669',
        }
      }
    },
  },
  plugins: [],
}
