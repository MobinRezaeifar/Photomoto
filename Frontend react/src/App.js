import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Routes/Register";
import Main from "./Routes/Main";
import ShowAccount from "./components/Global/ShowAccount";
import "./App.css";
import CreateStoty from "./Routes/CreateStoty";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/photomoto" element={<Main />} />
          <Route path="/photomoto/:username" element={<ShowAccount />} />
          <Route path="/photomoto/createStory" element={<CreateStoty />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;