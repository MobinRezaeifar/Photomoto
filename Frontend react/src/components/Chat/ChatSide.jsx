/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from "react";
import { CiMenuKebab, CiUser } from "react-icons/ci";
import { GoFileDirectoryFill } from "react-icons/go";
import { BsFillSendFill } from "react-icons/bs";
import {
  MdOutlineAlternateEmail,
  MdOutlineEmail,
  MdOutlineSettingsVoice,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Empty } from "antd";
import { AddMessages, fetchMessages } from "../../Redux/action";
import CryptoJS from "crypto-js";
import isEqual from "lodash.isequal";
import axios from "axios";
import { FaRegStopCircle } from "react-icons/fa";
import moment from "jalali-moment";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import TextMessageInbound from "./TextMessageInbound";
import TextMessageOutbound from "./TextMessageOutbound";
import FileMessageInbound from "./FileMessageInbound";
import FileMessageOutbound from "./FileMessageOutbound";
import ImageMessageInbound from "./ImageMessageInbound";
import ImageMessageOutbound from "./ImageMessageOutbound";
import VideoMessageInbound from "./VideoMessageInbound";
import VideoMessageOutbound from "./VideoMessageOutbound";
import VoiceMessageInbound from "./VoiceMessageInbound";
import VoiceMessageOutbound from "./VoiceMessageOutbound";
import { Dropdown } from "antd";
import { IoCamera } from "react-icons/io5";

const ChatSide = ({ SelectUser, Change, change, mainUser }) => {
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
  const navigate = useNavigate();
  const [TargetEmail, setTargetEmail] = useState("");
  const [TargetFullName, setTargetFullName] = useState("");
  const MessageFontSize = `text-md`;

  function decryptAES(message) {
    const bytes = CryptoJS.AES.decrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  useEffect(() => {
    dispatch(fetchMessages(sessionStorage.getItem("token")));
  }, []);

  useEffect(() => {
    dispatch(fetchMessages(sessionStorage.getItem("token")));
  }, [change]);

  const SendTextMessage = async () => {
    await Change("change");
    await dispatch(
      AddMessages({
        type: "txt",
        time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
        media: MessageText,
        sender: decryptAES(sessionStorage.getItem("u")),
        recipient: SelectUser,
        relationship: `${decryptAES(
          sessionStorage.getItem("u")
        )},${SelectUser}`,
        size: 0,
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
        size: file.size ? file.size / (1024 * 1024) : 0,
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
      if (window) {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

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
        setTargetEmail(data.email);
        setTargetFullName(data.fullName);
      }
      if (data.username == mainUser) {
        setMainUserImg(data.profileImg);
      }
    });
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [change]);
  useEffect(() => {
    scrollToBottom();
  }, [SelectUser]);
  let messageRenderdiv = document.getElementById("messageRenderdiv");

  const items = [
    {
      key: "1",
      label: (
        <a className="text-[1.2rem] w-full flex items-center justify-center gap-1">
          <CiUser size={25} />
          {TargetFullName}
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
          className="text-[1.2rem] w-full flex items-center justify-center gap-1"
        >
          <MdOutlineEmail size={25} />

          {TargetEmail}
        </a>
      ),
    },
  ];

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && MessageText) {
      SendTextMessage();
    }
  };

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
              onClick={() =>
                dispatch({
                  type: "SELECTUSERCHAT",
                  payload: "",
                })
              }
            />
          )}
          <span
            onClick={() => navigate(`${SelectUser}`)}
            className="cursor-pointer flex items-center gap-2 text-white"
          >
            <img
              class="w-11 h-11 p-1 rounded-xl ring-2 ring-gray-300 dark:ring-gray-500"
              src={TargetProfileImg}
              alt=""
            />
            <span className="text-gray-400 font-bold">{SelectUser}</span>
          </span>
        </span>
        <Dropdown menu={{ items }} placement="bottom" arrow trigger={["click"]}>
          <CiMenuKebab size={27} className="cursor-pointer" />
        </Dropdown>
      </div>

      <div
        id={`messageRenderdiv`}
        className="h-[80%] px-8 overflow-y-auto pt-4"
      >
        {messageRenderdiv && messageRenderdiv.textContent.trim() === "" && (
          <Empty />
        )}
        {!isEqual(Messages, []) &&
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
                      {data.type.startsWith("txt") && (
                        <TextMessageInbound
                          data={data}
                          MainUserImg={MainUserImg}
                          MessageFontSize={MessageFontSize}
                        />
                      )}
                      {data.type.startsWith("image") && (
                        <ImageMessageInbound
                          data={data}
                          MainUserImg={MainUserImg}
                          MessageFontSize={MessageFontSize}
                        />
                      )}
                      {data.type.startsWith("video") && (
                        <VideoMessageInbound
                          data={data}
                          MainUserImg={MainUserImg}
                          MessageFontSize={MessageFontSize}
                        />
                      )}
                      {data.type.startsWith("voice") && (
                        <VoiceMessageInbound
                          data={data}
                          MainUserImg={MainUserImg}
                          MessageFontSize={MessageFontSize}
                        />
                      )}
                      {(() => {
                        if (
                          data.type.startsWith("application") ||
                          data.type.startsWith("text/plain")
                        ) {
                          return (
                            <FileMessageInbound
                              data={data}
                              MainUserImg={MainUserImg}
                              MessageFontSize={MessageFontSize}
                            />
                          );
                        }
                      })()}
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
                      {data.type.startsWith("txt") && (
                        <TextMessageOutbound
                          data={data}
                          MainUserImg={TargetProfileImg}
                          MessageFontSize={MessageFontSize}
                        />
                      )}
                      {data.type.startsWith("image") && (
                        <ImageMessageOutbound
                          data={data}
                          MainUserImg={TargetProfileImg}
                          MessageFontSize={MessageFontSize}
                        />
                      )}
                      {(() => {
                        if (
                          data.type.startsWith("application") ||
                          data.type.startsWith("text/plain")
                        ) {
                          return (
                            <FileMessageOutbound
                              data={data}
                              MainUserImg={TargetProfileImg}
                              MessageFontSize={MessageFontSize}
                            />
                          );
                        }
                      })()}

                      {data.type.startsWith("voice") && (
                        <VoiceMessageOutbound
                          data={data}
                          MainUserImg={TargetProfileImg}
                          MessageFontSize={MessageFontSize}
                        />
                      )}
                      {data.type.startsWith("video") && (
                        <VideoMessageOutbound
                          data={data}
                          MainUserImg={TargetProfileImg}
                          MessageFontSize={MessageFontSize}
                        />
                      )}
                    </div>
                  </div>
                );
              }
            }
          })}
        <div ref={messagesEndRef} />
      </div>
      <div className="h-[10%] w-full flex items-center px-8">
        <div className={`w-full flex justify-end items-center`}>
          <input
            className="w-full h-[3rem] bg-gray-700 rounded-[6px] text-white text-lg pr-10 pl-4"
            placeholder="Type..."
            type="text"
            value={MessageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
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
                <IoCamera size={24} onClick={() => navigate("createMessage")} />
                <label class="block" for="file_input">
                  <GoFileDirectoryFill size={21} className="cursor-pointer" />
                </label>
                <input
                  class="hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg
                   cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
