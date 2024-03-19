/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { GoFileDirectoryFill } from "react-icons/go";
import { BsFillSendFill } from "react-icons/bs";
import { MdKeyboardVoice, MdOutlineDownloading } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Empty } from "antd";
import { AddMessages, fetchMessages } from "../Redux/action";
import CryptoJS from "crypto-js";
import isEqual from "lodash.isequal";
import axios from "axios";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Image, Space } from "antd";

const ChatSide = ({ SelectUser, SelectUserImg, Change, change }) => {
  const [MessageText, setMessageText] = useState("");
  const dispatch = useDispatch();
  const Messages = useSelector((state) => state.Messages);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  const SendTextMessage = async () => {
    await Change("change");
    await dispatch(
      AddMessages({
        type: "text",
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

  const SendFileMessage = async (file) => {
    var form = new FormData();
    form.append("file", file);
    await axios.post("http://localhost:5221/api/FileManager/uploadfile", form);
    await dispatch(
      AddMessages({
        media: file.name,
        sender: decryptAES(sessionStorage.getItem("u")),
        recipient: SelectUser,
        relationship: `${decryptAES(
          sessionStorage.getItem("u")
        )},${SelectUser}`,
        type: file.type,
      })
    );
  };

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

  const onDownload = (src) => {
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = src.split(
          "http://localhost:5221/api/FileManager/downloadfile?FileName="
        )[1];
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
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
                        alignItems: "end",
                        gap: "0.5rem",
                      }}
                    >
                      {data.type.startsWith("text") && (
                        <div className=" bg-gray-600 rounded-bl-md rounded-t-md px-4 py-2">
                          {data.media.length > 50 ? (
                            <textarea
                              cols={20}
                              value={data.media}
                              className="bg-transparent"
                            />
                          ) : (
                            data.media
                          )}
                        </div>
                      )}
                      {data.type.startsWith("image") && (
                        <div className=" bg-gray-600 rounded-bl-md rounded-t-md p-3">
                          <Image
                            width={dimensions.width > 900 ? 300 : 200}
                            src={
                              "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                              data.media
                            }
                            preview={{
                              toolbarRender: (
                                _,
                                {
                                  transform: { scale },
                                  actions: {
                                    onFlipY,
                                    onFlipX,
                                    onRotateLeft,
                                    onRotateRight,
                                    onZoomOut,
                                    onZoomIn,
                                  },
                                }
                              ) => (
                                <Space size={12} className="toolbar-wrapper">
                                  <DownloadOutlined
                                    onClick={() =>
                                      onDownload(
                                        "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                                          data.media
                                      )
                                    }
                                  />
                                  <SwapOutlined rotate={90} onClick={onFlipY} />
                                  <SwapOutlined onClick={onFlipX} />
                                  <RotateLeftOutlined onClick={onRotateLeft} />
                                  <RotateRightOutlined
                                    onClick={onRotateRight}
                                  />
                                  <ZoomOutOutlined
                                    disabled={scale === 1}
                                    onClick={onZoomOut}
                                  />
                                  <ZoomInOutlined
                                    disabled={scale === 50}
                                    onClick={onZoomIn}
                                  />
                                </Space>
                              ),
                            }}
                          />
                        </div>
                      )}
                      {data.type.startsWith("video") && (
                        <div className=" bg-gray-600 rounded-bl-md rounded-t-md p-3">
                          <video
                            width={dimensions.width > 900 ? 300 : 200}
                            controls
                            src={
                              "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                              data.media
                            }
                          ></video>
                        </div>
                      )}
                      {data.type.startsWith("application") && (
                        <div
                          className=" bg-gray-600 items-center gap-2 rounded-bl-md rounded-t-md px-4 py-2 flex"
                          style={{ direction: "rtl" }}
                          title={data.media}
                        >
                          <MdOutlineDownloading
                            color="lightblue"
                            className="cursor-pointer "
                            size={35}
                            onClick={() =>
                              onDownload(
                                "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                                  data.media
                              )
                            }
                          />
                          {data.media.length > 20
                            ? "..." + data.media.substring(0, 20)
                            : data.media}
                        </div>
                      )}
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
                        alignItems: "end",
                        gap: "0.5rem",
                      }}
                    >
                      <Avatar src={SelectUserImg} />
                      {data.type.startsWith("text") && (
                        <div className=" bg-gray-600 rounded-bl-md rounded-t-md px-4 py-2">
                          {data.media.length > 50 ? (
                            <textarea
                              cols={20}
                              value={data.media}
                              className="bg-transparent"
                            />
                          ) : (
                            data.media
                          )}
                        </div>
                      )}
                      {data.type.startsWith("image") && (
                        <div className=" bg-gray-600 rounded-bl-md rounded-t-md p-3">
                          <Image
                            width={dimensions.width > 900 ? 300 : 200}
                            src={
                              "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                              data.media
                            }
                            preview={{
                              toolbarRender: (
                                _,
                                {
                                  transform: { scale },
                                  actions: {
                                    onFlipY,
                                    onFlipX,
                                    onRotateLeft,
                                    onRotateRight,
                                    onZoomOut,
                                    onZoomIn,
                                  },
                                }
                              ) => (
                                <Space size={12} className="toolbar-wrapper">
                                  <DownloadOutlined
                                    onClick={() =>
                                      onDownload(
                                        "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                                          data.media
                                      )
                                    }
                                  />
                                  <SwapOutlined rotate={90} onClick={onFlipY} />
                                  <SwapOutlined onClick={onFlipX} />
                                  <RotateLeftOutlined onClick={onRotateLeft} />
                                  <RotateRightOutlined
                                    onClick={onRotateRight}
                                  />
                                  <ZoomOutOutlined
                                    disabled={scale === 1}
                                    onClick={onZoomOut}
                                  />
                                  <ZoomInOutlined
                                    disabled={scale === 50}
                                    onClick={onZoomIn}
                                  />
                                </Space>
                              ),
                            }}
                          />
                        </div>
                      )}
                      {data.type.startsWith("application") && (
                        <div
                          className=" bg-gray-600 items-center gap-2 rounded-bl-md rounded-t-md px-4 py-2 flex"
                          title={data.media}
                        >
                          <MdOutlineDownloading
                            color="lightblue"
                            className="cursor-pointer "
                            size={35}
                            onClick={() =>
                              onDownload(
                                "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                                  data.media
                              )
                            }
                          />
                          {data.media.length > 20
                            ? data.media.substring(0, 20) + "..."
                            : data.media}
                        </div>
                      )}
                      {data.type.startsWith("video") && (
                        <div className=" bg-gray-600 rounded-bl-md rounded-t-md p-3">
                          <video
                            width={dimensions.width > 900 ? 300 : 200}
                            controls
                            src={
                              "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                              data.media
                            }
                          ></video>
                        </div>
                      )}
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
                onClick={SendTextMessage}
              />
            ) : (
              <React.Fragment>
                <label class="block" for="file_input">
                  <GoFileDirectoryFill size={21} className="cursor-pointer" />
                </label>
                <input
                  class="hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  onChange={(e) => SendFileMessage(e.target.files[0])}
                ></input>

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
