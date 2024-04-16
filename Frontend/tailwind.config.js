/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./src/*.jsx",
    "./src/*.jsx",
    "./src/*.js",
    "./src/components/*.jsx",
    "./src/Routes/*.jsx",
    "./src/components/*.jsx",
    "./src/components/Chat/*.jsx",
    "./src/components/Global/*.jsx",
    "./src/components/Issue/*.jsx",
    "./src/components/Me/*.jsx",
    "./src/components/Nav/*.jsx",
    "./src/components/Search/*.jsx",
    "./src/components/Connection/*.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
