/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { Button, Upload, Avatar, Badge } from "antd";
import { FaCircle } from "react-icons/fa";
import { AiFillBulb } from "react-icons/ai";
import ChatSide from "./ChatSide";

const Direct = ({ Change, change }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const Registers = useSelector((state) => state.Registers);
  const [SelectUser, setSelectUser] = useState("");
  const [SelectUserImg, setSelectUserImg] = useState("");

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
    <div className="flex items-center justify-center h-full w-full">
      <div
        className={`w-[20%] h-full bg-[#37415171] ${
          dimensions.width < 900 && "hidden"
        }`}
      >
        <div className="flex items-center w-full p-6 gap-1 h-[8%]">
          <lord-icon
            src="https://cdn.lordicon.com/wwpzpqta.json"
            trigger="hover"
            style={{ transform: "scale(1.2)" }}
          ></lord-icon>
          <h1 className="text-2xl font-bold">Direct</h1>
        </div>
        <div className="h-[92%] overflow-y-auto flex flex-col">
          {Registers.map(
            (data) =>
              data.username == decryptAES(sessionStorage.getItem("u")) &&
              data.connection.map((connect) => (
                <div
                  className={`w-full my-[0.3rem] px-3 ${
                    SelectUser == connect.username &&
                    "bg-base-100 rounded-s-[60px]"
                  }`}
                  onClick={() => {
                    setSelectUser(connect.username);
                    setSelectUserImg(connect.profileImg);
                  }}
                >
                  <div
                    className={`w-full  flex items-center gap-2 ${
                      SelectUser != connect.username && "hover:bg-base-100"
                    }`}
                    id="directItem"
                    style={{
                      borderRadius: "8px",
                      fontSize: "20px",
                      padding: "7px 10px",
                      // border: "1px solid gray",
                      cursor: "pointer",
                    }}
                  >
                    <Badge
                      count={
                        <Upload>
                          <Button
                            id="borderrnone"
                            icon={
                              <FaCircle
                                color="green"
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "2px",
                                }}
                                size={dimensions.width > 900 ? 12 : 11}
                              />
                            }
                          ></Button>
                        </Upload>
                      }
                    >
                      <Avatar
                        size={dimensions.width > 900 ? 40 : 40}
                        src={connect.profileImg}
                        shape="circle"
                      />
                    </Badge>
                    <div className="flex flex-col items-start ">
                      <span className="text-white"> {connect.username}</span>
                      <span className="text-sm">Connect with you.</span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
      <div className=" w-[80%] h-full bg-base-100">
        {SelectUser ? (
          <div className="h-full w-full">
            <ChatSide
              SelectUser={SelectUser}
              SelectUserImg={SelectUserImg}
              Change={Change}
              change={change}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-2xl flex items-center gap-2">
              <AiFillBulb color="yellow" size={30} />
              Plase Select User
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Direct;
