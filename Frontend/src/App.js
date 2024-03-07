import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Routes/Register";
import Home from "./Routes/Home";
import { useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import CreatePost from "./Routes/CreatePost";



function App() {

  const [change, setchange] = useState([]);

  const Change = async (change) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(`https://localhost:7028/change`)
        .configureLogging(LogLevel.Information)
        .build();
      await connection.start();

      connection.invoke("Connect", change).catch((err) => console.error(err));

      connection.on("getChange", (chang) => {
        setchange(chang);
      });

      // setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/photomoto" element={<Home Change={Change} change={change}/>} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/photomoto/edit" element={<CreatePost />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
