/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "media",
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./**/*.{ts,tsx}"],
  plugins: [require("@tailwindcss/forms")]
};
