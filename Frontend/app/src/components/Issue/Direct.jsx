/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { Button, Upload, Avatar, Badge } from "antd";
import { FaCircle } from "react-icons/fa";
import { AiFillBulb } from "react-icons/ai";
import ChatSide from "../Chat/ChatSide";
import { motion } from "framer-motion";

const Direct = ({ Change, change }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const dispatch = useDispatch();
  const Registers = useSelector((state) => state.Registers);
  const SelectUserChat = useSelector((state) => state.SelectUserChat);

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
  const constraintsRef = useRef(null);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div
        className={`w-[20%] h-full bg-[#37415171] ${
          !SelectUserChat && dimensions.width < 900 && "w-full"
        }
        ${SelectUserChat && dimensions.width < 900 && "hidden"}`}
      >
        <div className="flex items-center w-full p-6 gap-1 h-[8%]">
          <lord-icon
            src="https://cdn.lordicon.com/wwpzpqta.json"
            trigger="hover"
            style={{ transform: "scale(1.2)" }}
          ></lord-icon>
          <h1 className="text-2xl font-bold">Direct</h1>
        </div>
        <div
          className="h-[92%] overflow-y-auto flex flex-col" 
          ref={constraintsRef}
        >
          {Registers.map(
            (data) =>
              data.username == decryptAES(sessionStorage.getItem("u")) &&
              data.connection.map((connect) => (
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  initial={{ opacity: 0, x: !SelectUserChat && -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`w-full my-[0.3rem] px-3 ${
                    SelectUserChat == connect.username &&
                    "bg-base-100 rounded-s-[60px]"
                  }`}
                  onClick={() => {
                    dispatch({
                      type: "SELECTUSERCHAT",
                      payload: connect.username,
                    });
                  }}
                >
                  <div
                    className={`w-full  flex items-center gap-2 ${
                      SelectUserChat != connect.username && "hover:bg-base-100"
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
                        <Button
                          id="borderrnone"
                          icon={
                            <FaCircle
                              color="green"
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "2px",
                              }}
                              size={dimensions.width > 900 ? 12 : 11}
                            />
                          }
                        ></Button>
                      }
                    >
                      {(() => {
                        return Registers.map((dataa) => {
                          if (dataa.username == connect.username) {
                            return (
                              <Avatar
                                size={dimensions.width > 900 ? 40 : 40}
                                src={dataa.profileImg}
                                shape="circle"
                              />
                            );
                          }
                        });
                      })()}
                    </Badge>
                    <div className="flex flex-col items-start ">
                      <span className="text-white"> {connect.username}</span>
                      <span className="text-sm">Connect with you.</span>
                    </div>
                  </div>
                </motion.div>
              ))
          )}
        </div>
      </div>
      <div
        className={`w-[80%] h-full bg-base-100 ${
          !SelectUserChat && dimensions.width < 900 && "hidden"
        } ${SelectUserChat && "w-full"}`}
      >
        {SelectUserChat ? (
          <div className="h-full w-full">
            <ChatSide
              SelectUser={SelectUserChat}
              Change={Change}
              change={change}
              mainUser={decryptAES(sessionStorage.getItem("u"))}
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
