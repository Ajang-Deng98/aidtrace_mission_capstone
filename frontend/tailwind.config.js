/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'canva-purple': '#7D2AE8',
        'canva-blue': '#00C4CC',
        'canva-pink': '#FF5757',
        'canva-yellow': '#FFB800',
        'canva-green': '#00C875',
        'deep-blue': '#1E3A8A',
        'bright-blue': '#2563EB',
      },
    },
  },
  plugins: [],
}
