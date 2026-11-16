/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cobalt: "#0038FF",
        lime: "#BEF264",
        carbon: "#0F172A",
        paper: "#FAFAFA",
      },
    },
  },
  plugins: [],
};
