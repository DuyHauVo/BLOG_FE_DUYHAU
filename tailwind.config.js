/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playwrite: ['"Playwrite PL"', "cursive"],
        playwrite: ['"Playfair Display"', "serif"],
        dancing: ['"Dancing Script"', "cursive"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
