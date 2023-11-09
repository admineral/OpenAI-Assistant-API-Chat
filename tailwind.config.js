/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-grey': {
          light: '#ededed' // Replace this with the hex code for light space-grey you prefer
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

