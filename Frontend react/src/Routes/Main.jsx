/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import CryptoJS from "crypto-js";

const Main = () => {
  const baseUrlDotenet = useSelector((state) => state.baseUrlDotenet);
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
      if (window) {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

  if (sessionStorage.getItem("u") == null) {
    navigate("/");
  }
  const key = CryptoJS.enc.Utf8.parse("1234567890123456");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
  function decryptAES(message) {
    const bytes = CryptoJS.AES.decrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return bytes.toString(CryptoJS.enc.Utf8);
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
        .withUrl(`${baseUrlDotenet}change`)
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
        .withUrl(`${baseUrlDotenet}onlineUsers`)
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
  let mainUser = decryptAES(sessionStorage.getItem("u"));
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
