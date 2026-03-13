/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#27248C',
        primaryLight: '#4857A8',
        dashboardBg: '#DFE8F0',
        card: '#C5CED7',
        muted: '#8391B2',
        softGray: '#B3BEC7',
      },
    },
  },
  plugins: [],
}
