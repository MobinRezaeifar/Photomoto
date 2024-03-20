/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftNav from "../components/Nav/LeftNav";
import BottomNav from "../components/Nav/BottomNav";
import Connection from "../components/Issue/Connection";
import Search from "../components/Search/Search";
import Direct from "../components/Issue/Direct";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister } from "../Redux/action";
import Home from "../components/Issue/Home";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Me from "../components/Issue/Me";

const Main = () => {
  let navigate = useNavigate();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateSize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  if (sessionStorage.getItem("e") == null) {
    navigate("/");
  }
  const Issue = useSelector((state) => state.Issue);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRegister());
  }, [dispatch]);

  const [change, setchange] = useState([]);

  const Change = async (change) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(`http://localhost:5221/change`)
        .configureLogging(LogLevel.Information)
        .build();
      await connection.start();

      connection.invoke("Connect", change).catch((err) => console.error(err));

      connection.on("getChange", (chang) => {
        setchange(chang);
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div
      className={`h-screen w-screen flex ${
        dimensions.width > 900 ? "flex-row" : "flex-col"
      } `}
    >
      {dimensions.width > 900 ? (
        <React.Fragment>
          <LeftNav />
          <div
            className="w-[100%] h-full  overflow-y-auto "
            style={{ paddingRight: "4%" }}
          >
            {Issue == "me" && <Me />}
            {Issue == "connection" && <Connection />}
            {Issue == "search" && <Search />}
            {Issue == "direct" && <Direct Change={Change} change={change} />}
            {Issue == "home" && <Home />}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div
            className="w-full overflow-y-auto h-full "
            style={{ paddingBottom: "7%" }}
          >
            {Issue == "me" && <Me />}
            {Issue == "connection" && <Connection />}
            {Issue == "search" && <Search />}
            {Issue == "direct" && <Direct Change={Change} change={change} />}
            {Issue == "home" && <Home />}
          </div>
          <BottomNav />
        </React.Fragment>
      )}
    </div>
  );
};

export default Main;
