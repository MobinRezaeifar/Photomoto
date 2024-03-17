/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { GoFileDirectoryFill } from "react-icons/go";
import { BsFillSendFill } from "react-icons/bs";
import { MdKeyboardVoice } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Empty } from "antd";
import { AddMessages, fetchMessages } from "../Redux/action";
import CryptoJS from "crypto-js";
import isEqual from "lodash.isequal";

const ChatSide = ({ SelectUser, SelectUserImg, Change, change }) => {
  const [MessageText, setMessageText] = useState("");
  const dispatch = useDispatch();
  const Messages = useSelector((state) => state.Messages);

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

  useEffect(() => {
    dispatch(fetchMessages());
  }, []);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [change]);

  const SendMessage = async () => {
    await Change("change");
    await dispatch(
      AddMessages({
        media: MessageText,
        sender: decryptAES(sessionStorage.getItem("u")),
        recipient: SelectUser,
        relationship: `${decryptAES(
          sessionStorage.getItem("u")
        )},${SelectUser}`,
      })
    );
    await setMessageText("");
    await Change("change");
  };

  return (
    <div className="h-screen">
      <div
        className="flex justify-between items-center px-5  h-[10%] rounded-b-[1.2rem] bg-[#37415171] mx-8"
        style={{ boxShadow: "0px 38px 67px -19px rgba(255,255,255,0.02)" }}
      >
        <span className="flex items-center gap-2 text-2xl">
          <Avatar size={37} src={SelectUserImg} /> {SelectUser}
        </span>
        <CiMenuKebab size={27} />
      </div>

      <div className="h-[80%] px-8 overflow-y-auto pt-4">
        {!isEqual(Messages, []) ? (
          Messages.map((data) => {
            if (
              data.relationship ==
                `${decryptAES(sessionStorage.getItem("u"))},${SelectUser}` ||
              data.relationship ==
                `${SelectUser},${decryptAES(sessionStorage.getItem("u"))}`
            ) {
              if (data.recipient == SelectUser) {
                return (
                  <div className="flex justify-end w-full mb-4">
                    <div
                      style={{
                        maxWidth: "50%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div className=" bg-gray-600 rounded-bl-md rounded-t-md px-4 py-2">
                        {data.media}
                      </div>
                      <Avatar src={SelectUserImg} />
                    </div>
                  </div>
                );
              }
              if (data.sender == SelectUser) {
                return (
                  <div className="flex justify-start w-full mb-4">
                    <div
                      style={{
                        maxWidth: "50%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Avatar src={SelectUserImg} />
                      <div className=" bg-gray-700 rounded-br-md rounded-t-md px-4 py-2">
                        {data.media}
                      </div>
                    </div>
                  </div>
                );
              }
            } 
          })
        ) : (
          <Empty />
        )}
      </div>
      <div className="h-[10%] w-full flex items-center px-8">
        <div className="w-full flex justify-end items-center ">
          <input
            className="w-full h-[3rem] bg-gray-700 rounded-[6px] px-2 "
            placeholder="Type..."
            type="text"
            value={MessageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <div className="absolute flex gap-2 items-center mr-3">
            {MessageText ? (
              <BsFillSendFill
                size={20}
                className="cursor-pointer"
                onClick={SendMessage}
              />
            ) : (
              <React.Fragment>
                <GoFileDirectoryFill size={21} className="cursor-pointer" />
                <MdKeyboardVoice size={23} className="cursor-pointer" />
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSide;
