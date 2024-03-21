/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { GoFileDirectoryFill } from "react-icons/go";
import { BsFillSendFill } from "react-icons/bs";
import {
  MdKeyboardVoice,
  MdOutlineDownloading,
  MdOutlineSettingsVoice,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Empty } from "antd";
import { AddMessages, fetchMessages } from "../../Redux/action";
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
import { FaRegStopCircle } from "react-icons/fa";
import VoiceMessage from "./VoiceMessage";
import moment from "jalali-moment";
import { FaArrowRight } from "react-icons/fa6";

const ChatSide = ({
  SelectUser,
  SelectUserImg,
  Change,
  change,
  setSelectUser,
  mainUser,
}) => {
  const [MessageText, setMessageText] = useState("");
  const dispatch = useDispatch();
  const Messages = useSelector((state) => state.Messages);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const Registers = useSelector((state) => state.Registers);
  let StartBtn = document.getElementById("StartBtn");
  let StopBtn = document.getElementById("StopBtn");
  const key = CryptoJS.enc.Utf8.parse("1234567890123456");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const recordedChunks = useRef([]);
  const now = Date.now();
  const [TargetProfileImg, setTargetProfileImg] = useState("");
  const [MainUserImg, setMainUserImg] = useState("");

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
        time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
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
    await Change("change");
    var form = new FormData();
    form.append("file", file);
    await axios.post("http://localhost:5221/api/FileManager/uploadfile", form);
    await dispatch(
      AddMessages({
        media: file.name,
        time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
        sender: decryptAES(sessionStorage.getItem("u")),
        recipient: SelectUser,
        relationship: `${decryptAES(
          sessionStorage.getItem("u")
        )},${SelectUser}`,
        type: file.type,
      })
    );
    await Change("change");
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

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (e) => {
          recordedChunks.current.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(recordedChunks.current, { type: "audio/wav" });
          const url = URL.createObjectURL(blob);
          const formData = new FormData();
          let filename = Date.now() + ".wav";
          formData.append("file", blob, filename);
          UploadVoice(formData);
          await dispatch(
            AddMessages({
              media: filename,
              sender: decryptAES(sessionStorage.getItem("u")),
              recipient: SelectUser,
              time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
              relationship: `${decryptAES(
                sessionStorage.getItem("u")
              )},${SelectUser}`,
              type: "voice",
            })
          );
          await Change("change");
          const a = document.createElement("a");
          a.href = url;
          a.download = "recorded_audio.wav";
          // document.body.appendChild(a);
          // a.click();
          window.URL.revokeObjectURL(url);
          recordedChunks.current = [];
        };

        recorder.start();
        StartBtn.classList.add("hidden");
        StopBtn.classList.remove("hidden");
        setIsRecording(true);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      StartBtn.classList.remove("hidden");
      StopBtn.classList.add("hidden");
      setIsRecording(false);
    }
  };

  const UploadVoice = (formData) => {
    let url = `http://localhost:5221/api/FileManager/uploadfile`;
    axios
      .request({
        method: "POST",
        data: formData,
        url,
        onUploadProgress: (e) => {
          var percentComplete = Math.ceil((e.loaded / e.total) * 100);
        },
      })
      .then((response) => {
        console.log(response);
      });
  };

  useEffect(() => {
    Registers.map((data) => {
      if (data.username == SelectUser) {
        setTargetProfileImg(data.profileImg);
      }
      if (data.username == mainUser) {
        setMainUserImg(data.profileImg);
      }
    });
  });

  return (
    <div className={`h-screen ${dimensions.width < 900 && "pb-16"}`}>
      <div
        className="flex justify-between items-center px-5  h-[10%] rounded-b-[1.2rem] bg-[#37415171] mx-8"
        style={{ boxShadow: "0px 38px 67px -19px rgba(255,255,255,0.02)" }}
      >
        <span className="flex items-center gap-2 text-2xl">
          {dimensions.width < 900 && (
            <FaArrowRight
              style={{
                transform: "rotate(180deg)",
                marginRight: "5px",
                cursor: "pointer",
              }}
              onClick={() => setSelectUser("")}
            />
          )}
          <Avatar size={37} src={TargetProfileImg} /> {SelectUser}
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
                        maxWidth: dimensions.width < 900 ? "100%" : "50%",
                        display: "flex",
                        alignItems: "end",
                        gap: "0.5rem",
                      }}
                    >
                      {data.type.startsWith("text") && (
                        <div className=" bg-gray-500  rounded-bl-md rounded-t-md px-4 py-2  text-xl flex flex-col items-end">
                          <span className="text-sm">{data.time}</span>
                          {data.media.length > 50 ? (
                            <textarea
                              rows={3}
                              value={data.media}
                              className="bg-transparent text-white text-lg"
                            />
                          ) : (
                            <span className="text-white text-lg">
                              {data.media}
                            </span>
                          )}
                        </div>
                      )}
                      {data.type.startsWith("image") && (
                        <div className=" bg-gray-500 rounded-bl-md rounded-t-md px-3 py-2 flex flex-col items-end text-lg">
                          <span className="mb-2 text-sm">{data.time}</span>
                          <Image
                            className="mb-2"
                            width={dimensions.width > 900 ? 200 : 100}
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
                          <span title={data.media} className="text-white ">
                            {data.media.length > 20
                              ? data.media.substring(0, 10) +
                                "..." +
                                data.type.split("/")[1]
                              : data.media}
                          </span>
                        </div>
                      )}
                      {data.type.startsWith("video") && (
                        <div className=" bg-gray-500 rounded-bl-md rounded-t-md px-3 py-2 flex flex-col items-end text-lg">
                          <span className="text-sm mb-2">{data.time}</span>
                          <video
                            muted
                            className="mb-2"
                            loop
                            width={dimensions.width > 900 ? 200 : 100}
                            controls
                            autoPlay
                            src={
                              "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                              data.media
                            }
                          ></video>
                          <span title={data.media} className="text-white ">
                            {data.media.length > 20
                              ? data.media.substring(0, 10) +
                                "..." +
                                data.type.split("/")[1]
                              : data.media}
                          </span>
                        </div>
                      )}
                      {data.type.startsWith("voice") && (
                        <div className=" bg-gray-500  rounded-br-md rounded-t-md px-4 py-2 flex items-end flex-col">
                          <span className="text-sm mb-1">{data.time}</span>

                          <VoiceMessage data={data} />
                        </div>
                      )}
                      {data.type.startsWith("application") && (
                        <div
                          className=" bg-gray-500 text-white items-center gap-2 rounded-bl-md rounded-t-md px-4 py-2 flex"
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
                      <Avatar src={MainUserImg} />
                    </div>
                  </div>
                );
              }
              if (data.sender == SelectUser) {
                return (
                  <div className="flex justify-start w-full mb-4">
                    <div
                      style={{
                        maxWidth: dimensions.width < 900 ? "100%" : "50%",
                        display: "flex",
                        alignItems: "end",
                        gap: "0.5rem",
                      }}
                    >
                      <Avatar src={TargetProfileImg} />
                      {data.type.startsWith("text") && (
                        <div className=" bg-gray-600  rounded-br-md rounded-t-md px-4 py-2  text-xl flex flex-col items-start">
                          <span className="text-sm">{data.time}</span>
                          {data.media.length > 50 ? (
                            <textarea
                              rows={3}
                              value={data.media}
                              className="bg-transparent text-white text-lg"
                            />
                          ) : (
                            <span className="text-white text-lg">
                              {data.media}
                            </span>
                          )}
                        </div>
                      )}
                      {data.type.startsWith("image") && (
                        <div className=" bg-gray-600 rounded-br-md rounded-t-md px-3 py-2 flex flex-col items-start text-lg">
                          <span className="mb-2 text-sm">{data.time}</span>
                          <Image
                            className="mb-2"
                            width={dimensions.width > 900 ? 200 : 100}
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
                          <span title={data.media} className="text-white ">
                            {data.media.length > 20
                              ? data.media.substring(0, 10) +
                                "..." +
                                data.type.split("/")[1]
                              : data.media}
                          </span>
                        </div>
                      )}
                      {data.type.startsWith("application") && (
                        <div
                          className=" bg-gray-600 text-white  items-center gap-2 rounded-br-md rounded-t-md px-4 py-2 flex"
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
                      {data.type.startsWith("voice") && (
                        <div className=" bg-gray-600  rounded-br-md rounded-t-md px-4 py-2 flex flex-col">
                          <span className="text-sm mb-1">{data.time}</span>
                          <VoiceMessage data={data} />
                        </div>
                      )}
                      {data.type.startsWith("video") && (
                        <div className=" bg-gray-600 rounded-br-md rounded-t-md px-3 py-2 flex flex-col items-start text-lg">
                          <span className="text-sm mb-2">{data.time}</span>
                          <video
                            muted
                            className="mb-2"
                            loop
                            width={dimensions.width > 900 ? 200 : 100}
                            controls
                            autoPlay
                            src={
                              "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                              data.media
                            }
                          ></video>
                          <span title={data.media} className="text-white ">
                            {data.media.length > 20
                              ? data.media.substring(0, 10) +
                                "..." +
                                data.type.split("/")[1]
                              : data.media}
                          </span>
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
        <div className={`w-full flex justify-end items-center `}>
          <input
            className="w-full h-[3rem] bg-gray-700 rounded-[6px] px-2 text-white text-lg"
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

                <button
                  type="button"
                  className=""
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  id="StartBtn"
                >
                  <MdOutlineSettingsVoice size={23} />
                </button>
                <button
                  type="button"
                  className=" hidden"
                  onClick={handleStopRecording}
                  disabled={!isRecording}
                  id="StopBtn"
                >
                  <FaRegStopCircle size={25} />
                </button>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSide;
