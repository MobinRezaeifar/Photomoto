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
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const Direct = ({ Change, change, OnlineUsers }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const dispatch = useDispatch();
  const Registers = useSelector((state) => state.Registers);
  const SelectUserChat = useSelector((state) => state.SelectUserChat);
  const Connections = useSelector((state) => state.Connections);

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
      if (window) {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);
  const constraintsRef = useRef(null);

  useEffect(() => {
    window.addEventListener("blur", () => {
      console.log("end");
    });
    window.addEventListener("focus", () => {
      console.log("start");
    });
  });

  const [Users, setOUsers] = useState([]);

  useEffect(() => {
    Connections.map((data) => {
      if (
        data.sender == decryptAES(sessionStorage.getItem("u")) ||
        data.receiver == decryptAES(sessionStorage.getItem("u"))
      ) {
        let targetUser =
          data.sender == decryptAES(sessionStorage.getItem("u"))
            ? data.receiver
            : data.sender;
        if (data.status == "accept") {
          const existingUser = Users.find(
            (user) => user.username == targetUser
          );
          if (!existingUser) {
            Users.push({
              username: targetUser,
              status: "offline",
            });
          }
        }
      }
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <motion.div
        // initial={{ opacity: 0, x: dimensions.width > 900 && -70 }}
        // animate={{ opacity: 1, x: dimensions.width > 900 && 0 }}
        // transition={{ duration: 0.8 }}
        className={`w-[20%] h-full bg-[#37415171] ${
          !SelectUserChat && dimensions.width < 900 && "w-full"
        }
        ${SelectUserChat && dimensions.width < 900 && "hidden"}`}
      >
        <div className="flex items-center w-full p-6 gap-1 h-[10%]">
          <lord-icon
            src="https://cdn.lordicon.com/wwpzpqta.json"
            trigger="hover"
            style={{ transform: "scale(1.2)" }}
          ></lord-icon>
          <h1 className="text-2xl font-bold">Direct</h1>
        </div>
        <div
          className="overflow-y-auto flex flex-col h-[90%]"
          ref={constraintsRef}
        >
          {(() => {
            return Users.map((data) => {
              return (
                <motion.div
                  initial={{ opacity: 0, x: !SelectUserChat && -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`w-full my-[0.3rem] px-3 ${
                    SelectUserChat == data.username &&
                    "bg-base-100 rounded-s-[60px]"
                  }`}
                  onClick={() => {
                    dispatch({
                      type: "SELECTUSERCHAT",
                      payload: data.username,
                    });
                  }}
                >
                  <div
                    className={`w-full  flex items-center gap-2 ${
                      SelectUserChat != data.username && "hover:bg-base-100"
                    }`}
                    id="directItem"
                    style={{
                      borderRadius: "8px",
                      fontSize: "20px",
                      padding: "7px 10px",
                      cursor: "pointer",
                    }}
                  >
                    {(() => {
                      let status = OnlineUsers.some(
                        (x) => x.username == data.username
                      );
                      return (
                        <Badge
                          count={
                            <Button
                              id="borderrnone"
                              icon={
                                <FaCircle
                                  color={status ? "green" : "red"}
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
                              if (dataa.username == data.username) {
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
                      );
                    })()}
                    <div className="flex flex-col items-start ">
                      <span className="text-white"> {data.username}</span>
                      <span className="text-sm">Connect with you.</span>
                    </div>
                  </div>
                </motion.div>
              );
            });
          })()}
        </div>
      </motion.div>
      <div
        className={`w-[80%] h-full bg-base-100 ${
          !SelectUserChat && dimensions.width < 900 && "hidden"
        } ${SelectUserChat && "w-full"}`}
      >
        {SelectUserChat ? (
          <div className="h-full w-full">
            <ChatSide
              OnlineUsers={OnlineUsers}
              dimensions={dimensions}
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
