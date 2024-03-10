import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Routes/Register";
import Main from "./Routes/Main";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/photomoto" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
