/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import LeftNav from "../components/Nav/LeftNav";
import BottomNav from "../components/Nav/BottomNav";
import Connection from "../components/Issue/Connection";
import Search from "../components/Issue/Search";
import Direct from "../components/Issue/Direct";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister } from "../Redux/action";
import Home from "../components/Issue/Home";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Me from "../components/Issue/Me";
import Cookies from "js-cookie";

const Main = () => {
  const Issue = useSelector((state) => state.Issue);
  const PMCbaseApi = useSelector((state) => state.PMCbaseApi);

  const dispatch = useDispatch();
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
      if (window) {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

  if (Cookies.get("u") == null) {
    window.location.assign("/");
  }

  useEffect(() => {
    dispatch(fetchRegister());
  }, [dispatch]);

  const [change, setchange] = useState([]);

  const Change = async (change) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(`${PMCbaseApi}change`)
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

  const [OnlineUsers, setOnlineUsers] = useState([]);

  const onlineUsers = async (onlineUser) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(`${PMCbaseApi}onlineUsers`)
        .configureLogging(LogLevel.Information)
        .build();
      await connection.start();

      connection
        .invoke("Connect", onlineUser)
        .catch((err) => console.error(err));

      connection.on("getOnlineUsers", (onlineuser) => {
        setOnlineUsers(onlineuser);
      });
    } catch (e) {
      console.log(e);
    }
  };
  let mainUser = Cookies.get("u");
  useEffect(() => {
    onlineUsers(mainUser);
  }, []);

  useEffect(() => {
    dispatch(fetchRegister());
  }, []);

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
            {Issue == "me" && <Me Change={Change} change={change} />}
            {Issue == "connection" && (
              <Connection Change={Change} change={change} />
            )}
            {Issue == "search" && <Search Change={Change} change={change} />}
            {Issue == "direct" && (
              <Direct
                OnlineUsers={OnlineUsers}
                Change={Change}
                change={change}
              />
            )}
            {Issue == "home" && <Home change={change} Change={Change} />}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div
            className="w-full overflow-y-auto h-full "
            style={{ paddingBottom: "7%" }}
          >
            {Issue == "me" && <Me Change={Change} change={change} />}
            {Issue == "connection" && (
              <Connection Change={Change} change={change} />
            )}
            {Issue == "search" && <Search Change={Change} change={change} />}
            {Issue == "direct" && (
              <Direct
                OnlineUsers={OnlineUsers}
                Change={Change}
                change={change}
              />
            )}
            {Issue == "home" && <Home change={change} Change={Change} />}
          </div>
          <BottomNav />
        </React.Fragment>
      )}
    </div>
  );
};

export default Main;
