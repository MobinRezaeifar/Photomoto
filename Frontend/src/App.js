import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Routes/Register";
import Main from "./Routes/Main";
import ShowAccount from "./components/ShowAccount";
function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/photomoto" element={<Main />} />
          <Route path="/photomoto/:username" element={<ShowAccount />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
