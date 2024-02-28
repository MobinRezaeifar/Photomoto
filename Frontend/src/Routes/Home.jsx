import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { GoSearch } from "react-icons/go";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdConnectWithoutContact } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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

  let navigate = useNavigate();
  if (sessionStorage.getItem("e") == null) {
    navigate("/login");
  }
  return (
    <div
      className={`h-screen w-screen flex ${
        dimensions.width > 900 ? "flex-row" : "flex-col"
      } `}
    >
      {dimensions.width > 900 ? (
        <>
          <div
            className="w-[4%] h-full flex flex-col gap-3 items-center p-4 justify-around bg-[#393939] absolute left-0"
            // style={{ borderRadius: "0 10px  10px 0" }}
          >
            <FaUserAlt size={25} style={{ cursor: "pointer" }} />
            <MdConnectWithoutContact size={25} style={{ cursor: "pointer" }} />
            <GoSearch size={25} style={{ cursor: "pointer" }} />
            <IoChatbubbleEllipsesOutline
              size={25}
              style={{ cursor: "pointer" }}
            />
            <IoHome size={25} style={{ cursor: "pointer" }} />
          </div>
          <div
            className="w-[100%] h-full bg-white overflow-y-auto"
            style={{ paddingLeft: "4%" }}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates
            deleniti beatae aperiam eum, accusamus laboriosam ut consequuntur
            tempora assumenda et, suscipit mollitia qui doloribus voluptas
            voluptatem a pariatur eius harum? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Voluptates deleniti beatae aperiam
            eum, accusamus laboriosam ut consequuntur tempora assumenda et,
            suscipit mollitia qui doloribus voluptas voluptatem a pariatur eius
            harum? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptates deleniti beatae aperiam eum, accusamus laboriosam ut
            consequuntur tempora assumenda et, suscipit mollitia qui doloribus
            voluptas voluptatem a pariatur eius harum? Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Voluptates deleniti beatae
            aperiam eum, accusamus laboriosam ut consequuntur tempora assumenda
            et, suscipit mollitia qui doloribus voluptas voluptatem a pariatur
            eius harum? Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Voluptates deleniti beatae aperiam eum, accusamus laboriosam
            ut consequuntur tempora assumenda et, suscipit mollitia qui
            doloribus voluptas voluptatem a pariatur eius harum? Lorem ipsum
            dolor sit amet, consectetur adipisicing elit. Volup ut consequuntur
            tempora assumenda et, suscipit mollitia qui doloribus voluptas
            voluptatem a pariatur eius harum?
          </div>
        </>
      ) : (
        <>
          <div
            className="w-full overflow-y-scroll h-full bg-white"
            style={{ paddingBottom: "7%" }}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates
            deleniti beatae aperiam eum, accusamus laboriosam ut consequuntur
            tempora assumenda et, suscipit mollitia qui doloribus voluptas
            voluptatem a pariatur eius harum? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Voluptates deleniti beatae aperiam
            eum, accusamus laboriosam ut consequuntur tempora assumenda et,
            suscipit mollitia qui doloribus voluptas voluptatem a pariatur eius
            harum? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptates deleniti beatae aperiam eum, accusamus laboriosam ut
            consequuntur tempora assumenda et, suscipit mollitia qui doloribus
            voluptas voluptatem a pariatur eius harum? Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Voluptates deleniti beatae
            aperiam eum, accusamus laboriosam ut consequuntur tempora assumenda
            et, suscipit mollitia qui doloribus voluptas voluptatem a pariatur
            eius harum? Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Voluptates deleniti beatae aperiam eum, accusamus laboriosam
            ut consequuntur tempora assumenda et, suscipit mollitia qui
            doloribus voluptas voluptatem a pariatur eius harum? Lorem ipsum
            dolor sit amet, consectetur adipisicing elit. Volup ut consequuntur
            tempora assumenda et, suscipit mollitia qui doloribus voluptas
            voluptatem a pariatur eius harum?
          </div>
          <div
            className="h-[7%] w-full flex absolute bottom-0  py-6 justify-around items-center bg-[#393939]"
            // style={{ borderRadius: "17px 17px 0 0" }}
          >
            <FaUserAlt size={25} style={{ cursor: "pointer" }} />
            <MdConnectWithoutContact size={25} style={{ cursor: "pointer" }} />
            <GoSearch size={25} style={{ cursor: "pointer" }} />
            <IoChatbubbleEllipsesOutline
              size={25}
              style={{ cursor: "pointer" }}
            />
            <IoHome size={25} style={{ cursor: "pointer" }} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
