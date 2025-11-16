/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: '#F5F5DC',
        'beige-muted': '#C5B79E', // subtle accent tone
      },
      boxShadow: {
        'soft-beige': '0 6px 20px rgba(197,183,158,0.12)',
      },
    },
  },
  plugins: [],
}

