/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./src/*.jsx",
    "./src/*.jsx",
    "./src/*.js",
    "./src/components/*.jsx",
    "./src/routes/*.jsx",
    "./src/Routes/Register.jsx",
    "./src/Routes/Home.tsx",
    "./src/Components/AddTaskModel.jsx",
    "./src/Components/ComplatedNoteModel.jsx",
    "./src/Components/SettingModel.jsx",
    "./src/Components/SideBar.jsx",
    "./src/Components/NoteItem.jsx",
    "./src/Components/MiniSliderBar.jsx",
    "./src/Components/Hero.jsx",
    "./src/Components/TopUser.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
