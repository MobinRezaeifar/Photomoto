import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Routes/Register";
import Home from "./Routes/Home";


function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/photomoto" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
