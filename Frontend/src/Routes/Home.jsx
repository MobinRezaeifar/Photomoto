import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { GoSearch } from "react-icons/go";
import { MdOutlineLocationSearching } from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdConnectWithoutContact } from "react-icons/md";

const Home = () => {
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
  return (
    <div
      className={`h-screen w-screen flex ${
        dimensions.width > 900 ? "flex-row" : "flex-col"
      } `}
    >
      {dimensions.width > 900 ? (
        <>
          <div className="w-[60px] h-full flex flex-col gap-3 items-center p-4 justify-around bg-[#393939] absolute left-0"  style={{borderRadius:"0 10px  10px 0"}}>
            <FaUserAlt size={25} />
            <MdConnectWithoutContact size={25} />
            <GoSearch size={25} />
            <IoChatbubbleEllipsesOutline size={25} />
            <IoHome size={25} />
          </div>
          <div className="w-[100%] h-full bg-white"></div>
        </>
      ) : (
        <>
          <div className="w-full h-full bg-white"></div>
          <div className="h-[7%] w-full flex absolute bottom-0  py-6 justify-around items-center bg-[#393939]" style={{borderRadius:"17px 17px 0 0"}}>
            <FaUserAlt size={25} />
            <MdConnectWithoutContact size={25} />
            <GoSearch size={25} />
            <IoChatbubbleEllipsesOutline size={25} />
            <IoHome size={25} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
