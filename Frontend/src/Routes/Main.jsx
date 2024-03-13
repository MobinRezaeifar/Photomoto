/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftNav from "../components/LeftNav";
import BottomNav from "../components/BottomNav";
import { useSelector } from "react-redux";
import Me from "../components/Me/Me";
import Connection from "../components/Connection";
import Search from "../components/Search/Search";
import Homee from "../components/Home";
import Direct from "../components/Direct";

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
    navigate("/register");
  }
  const Issue = useSelector((state) => state.Issue);
  return (
    <div
      className={`h-screen w-screen flex ${
        dimensions.width > 900 ? "flex-row" : "flex-col"
      } `}
    >
      {dimensions.width > 900 ? (
        <>
          <LeftNav />
          <div
            className="w-[100%] h-full  overflow-y-auto "
            style={{ paddingRight: "4%" }}
          >
            {Issue == "me" && <Me />}
            {Issue == "connection" && <Connection />}
            {Issue == "search" && <Search />}
            {Issue == "direct" && <Direct />}
            {Issue == "home" && <Homee />}
          </div>
        </>
      ) : (
        <>
          <div
            className="w-full overflow-y-auto h-full "
            style={{ paddingBottom: "7%" }}
          >
            {Issue == "me" && <Me />}
            {Issue == "connection" && <Connection />}
            {Issue == "search" && <Search />}
            {Issue == "direct" && <Direct />}
            {Issue == "home" && <Homee />}
          </div>
          <BottomNav />
        </>
      )}
    </div>
  );
};

export default Main;
