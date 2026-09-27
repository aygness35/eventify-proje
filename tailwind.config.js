/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        terracotta: "#F05335",
        "terracotta-hover": "#d94324",
        sand: "#FDFBF7",
        charcoal: "#1C1917",
      },
      fontFamily: {
        heading: ["Epilogue", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
