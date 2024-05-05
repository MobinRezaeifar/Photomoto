/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import {
  Avatar,
  Carousel,
  Col,
  Dropdown,
  InputNumber,
  Progress,
  Row,
  Slider,
} from "antd";
import { FaArrowCircleLeft, FaCircle } from "react-icons/fa";
import { BsRecordCircle } from "react-icons/bs";
import axios from "axios";
import isEqual from "lodash.isequal";
import { useDispatch, useSelector } from "react-redux";
import moment from "jalali-moment";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { MdEditRoad } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { AddStory } from "../../Redux/action";
import { motion } from "framer-motion";

function CreateMessage() {
  const videoRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [state, setstate] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [mediaResult, setmediaResult] = useState({});
  const [showFilterList, SetshowFilterList] = useState(false);
  const [Fillter, setFillter] = useState("");
  let navigate = useNavigate();
  const [DropDownShow, setDropDownShow] = useState(false);

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
    const timeout = setTimeout(() => {
      if (isMouseDown) {
        setstate(true);
        startVideoRecording();
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      setstate(false);
    };
  }, [isMouseDown]);

  useEffect(() => {
    const StartCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };
    StartCamera();
  }, []);

  useEffect(() => {
    const StartCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };
    StartCamera();
  }, [mediaResult]);

  const startVideoRecording = async () => {
    const stream = videoRef.current.captureStream();
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    const chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = async () => {
      let fileName = Date.now() + ".mp4";
      const blob = new Blob(chunks, { type: "video/webm" });
      var form = new FormData();
      form.append("file", blob, fileName);
      try {
        await axios.post("http://localhost:5001/api/upload", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
      }
      setTimeout(() => {
        setmediaResult({
          fileName,
          type: "video",
        });
      }, 1000);
      SetshowFilterList(true);
      setRecordingProgress(0);
    };

    recorder.start();
    setIsRecording(true);
  };
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingProgress((prevProgress) => prevProgress + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (recordingProgress >= 15) {
      stopVideoRecording();
    }
  });

  const stopVideoRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const TakePhoto = async () => {
    SetshowFilterList(true);
    let fileName = Date.now() + ".png";
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        var form = new FormData();
        await form.append("file", blob, fileName);
        try {
          await axios.post("http://localhost:5001/api/upload", form, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Photo uploaded successfully!");
        } catch (error) {
          console.error("Error uploading photo:", error);
        }
      }, "image/png");
    }
    setTimeout(() => {
      setmediaResult({
        fileName,
        type: "photo",
      });
    }, 1000);
  };
  const now = Date.now();

  const [grayscale, setgrayscale] = useState("");
  const [hue, sethue] = useState("");
  const [blur, setblur] = useState("");
  const [sepia, setsepia] = useState("");
  const [contrast, setcontrast] = useState("");
  const [saturate, setsaturate] = useState("");
  const [brightness, setbrightness] = useState("");
  let MaualFillter =
    grayscale +
    " " +
    hue +
    " " +
    blur +
    " " +
    sepia +
    " " +
    contrast +
    " " +
    saturate +
    " " +
    brightness +
    " ";
  const dispatch = useDispatch();

  const ShareStory = () => {
    if (!isEqual(mediaResult, {})) {
      dispatch(
        AddStory({
          owner: decryptAES(sessionStorage.getItem("u")),
          type: mediaResult.type,
          media: "http://localhost:5001/api/files/" + mediaResult.fileName,
          filter: Fillter ? Fillter : MaualFillter,
          time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
        })
      );
      SetshowFilterList(false);
      setmediaResult({});
      navigate("/photomoto");
      setFillter("");
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <motion.div drag className=" w-full md:w-[250px] bg-[#282828] p-4 rounded-lg">
          <div className="flex items-center gap-2 w-full">
            <div className="w-[150px] flex justify-start items-center gap-1">
              {" "}
              <IoCloseCircle
                size={20}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  sethue("");
                }}
              />
              <span
                style={{
                  border: "1px solid gray",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                hue
              </span>
            </div>
            {(() => {
              let test;
              return (
                <input
                  style={{ width: "150px" }}
                  onChange={(e) => {
                    sethue("hue-rotate(" + e.target.value + "deg)");
                    test = e.target.value;
                  }}
                  type="range"
                  min={0}
                  max="100"
                  className="range"
                  defaultValue={0}
                  value={hue == "" ? 0 : test}
                />
              );
            })()}
          </div>

          <div className="flex items-center gap-2 w-full mt-4">
            <div className="w-[150px] flex justify-start items-center gap-1">
              <IoCloseCircle
                size={20}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setblur("");
                }}
              />
              <span
                className=""
                style={{
                  border: "1px solid gray",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                blur
              </span>
            </div>
            {(() => {
              let test;
              return (
                <input
                  style={{ width: "150px" }}
                  onChange={(e) => {
                    setblur("blur(" + e.target.value + "px)");
                    test = e.target.value;
                  }}
                  type="range"
                  min={0}
                  max="10"
                  className="range"
                  defaultValue={0}
                  value={blur == "" ? 0 : test}
                />
              );
            })()}
          </div>
          <div className="flex items-center gap-2 w-full mt-4">
            <div className="w-[150px] flex justify-start items-center gap-1">
              <IoCloseCircle
                size={20}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setsepia("");
                }}
              />
              <span
                className=""
                style={{
                  border: "1px solid gray",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                sepia
              </span>
            </div>
            {(() => {
              let test;
              return (
                <input
                  style={{ width: "150px" }}
                  onChange={(e) => {
                    setsepia("sepia(" + e.target.value + "%)");
                    test = e.target.value;
                  }}
                  type="range"
                  min={0}
                  max="100"
                  className="range"
                  defaultValue={0}
                  value={sepia == "" ? 0 : test}
                />
              );
            })()}
          </div>

          <div className="flex items-center gap-2 w-full mt-4">
            <div className="w-[150px] flex justify-start items-center gap-1">
              <IoCloseCircle
                size={20}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setcontrast("");
                }}
              />
              <span
                className=""
                style={{
                  border: "1px solid gray",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                contrast
              </span>
            </div>
            {(() => {
              let test;
              return (
                <input
                  style={{ width: "150px" }}
                  onChange={(e) => {
                    setcontrast("contrast(" + e.target.value + "%)");
                    test = e.target.value;
                  }}
                  type="range"
                  min={0}
                  max="200"
                  className="range"
                  defaultValue={100}
                  value={contrast == "" ? 100 : test}
                />
              );
            })()}
          </div>
          <div className="flex items-center gap-2 w-full mt-4">
            <div className="w-[150px] flex justify-start items-center gap-1">
              <IoCloseCircle
                size={20}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setsaturate("");
                }}
              />
              <span
                className=""
                style={{
                  border: "1px solid gray",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                saturate
              </span>
            </div>
            {(() => {
              let test;
              return (
                <input
                  style={{ width: "150px" }}
                  onChange={(e) => {
                    setsaturate("saturate(" + e.target.value + ")");
                    test = e.target.value;
                  }}
                  type="range"
                  min={1}
                  max="10"
                  className="range"
                  defaultValue={1}
                  value={saturate == "" ? 1 : test}
                />
              );
            })()}
          </div>
          <div className="flex items-center gap-2 w-full mt-4">
            <div className="w-[150px] flex justify-start items-center gap-1">
              <IoCloseCircle
                size={20}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setgrayscale("");
                }}
              />
              <span
                className=""
                style={{
                  border: "1px solid gray",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                grayscale
              </span>
            </div>
            {(() => {
              let test;
              return (
                <input
                  style={{ width: "150px" }}
                  onChange={(e) => {
                    setgrayscale("grayscale(" + e.target.value + "%)");
                    test = e.target.value;
                  }}
                  type="range"
                  min={0}
                  max="100"
                  className="range"
                  defaultValue={0}
                  value={grayscale == "" ? 0 : test}
                />
              );
            })()}
          </div>
          <div className="flex items-center gap-2 w-full mt-4">
            <div className="w-[150px] flex justify-start items-center gap-1">
              <IoCloseCircle
                size={20}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setbrightness("");
                }}
              />
              <span
                className=""
                style={{
                  border: "1px solid gray",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                brightness
              </span>
            </div>
            {(() => {
              let test;
              return (
                <input
                  style={{ width: "150px" }}
                  onChange={(e) => {
                    setbrightness("brightness(" + e.target.value + ")");
                    test = e.target.value;
                  }}
                  type="range"
                  min={0.1}
                  max="3"
                  className="range"
                  defaultValue={1}
                  step="0.1"
                  value={brightness == "" ? 1 : test}
                />
              );
            })()}
          </div>
        </motion.div>
      ),
    },
  ];
  return (
    <div className="flex justify-center h-screen w-screen">
      <div className="w-full  md:w-[50%] bg-base-300 rounded-2xl">
        <div className="z-50 w-full  md:w-[50%] absolute flex justify-between p-4">
          <FaArrowCircleLeft
            size={30}
            className=" cursor-pointer"
            onClick={() => {
              SetshowFilterList(false);
              setmediaResult({});
              navigate("/photomoto");
              setFillter("");
            }}
          />
          <div className="flex items-center justify-center gap-2">
            <button
              className="btn glass bg-red-700 text-white"
              style={{ transform: "scale(0.9)" }}
              onClick={() => {
                SetshowFilterList(false);
                setmediaResult({});
                setFillter("");
                setgrayscale("");
                sethue("");
                setblur("");
                setsepia("");
                setcontrast("");
                setsaturate("");
                setbrightness("");
                setDropDownShow(false);
              }}
            >
              Discard
            </button>
            <button
              className="btn glass bg-blue-700 text-white"
              style={{ transform: "scale(0.9)" }}
              onClick={ShareStory}
            >
              Share
            </button>
          </div>
        </div>

        <div>
          {(() => {
            if (!isEqual(mediaResult, {})) {
              if (mediaResult.type === "video") {
                return (
                  <div
                    className="w-full h-screen flex text-center items-center justify-center "
                    style={{
                      borderRadius: "24px",
                      padding: "40px 0",
                      transform: "scaleX(-1)",
                    }}
                  >
                    <video
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: Fillter ? Fillter : MaualFillter,
                      }}
                      autoPlay
                      loop
                      src={`http://localhost:5001/api/files/${mediaResult.fileName}`}
                      alt=""
                    />
                  </div>
                );
              }
              if (mediaResult.type === "photo") {
                return (
                  <div
                    className="w-full h-screen flex text-center items-center justify-center "
                    style={{
                      borderRadius: "24px",
                      padding: "40px 0",
                      transform: "scaleX(-1)",
                    }}
                  >
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: Fillter ? Fillter : MaualFillter,
                      }}
                      src={`http://localhost:5001/api/files/${mediaResult.fileName}`}
                      alt=""
                    />
                  </div>
                );
              }
            } else {
              return (
                <video
                  style={{ transform: "scaleX(-1)" }}
                  ref={videoRef}
                  className="w-full h-screen"
                  autoPlay
                  muted
                />
              );
            }
          })()}
        </div>
        {showFilterList ? (
          <div className="absolute bottom-1  w-full pl-4  md:w-[50%] overflow-x-auto flex items-center">
            <div className="flex flex-no-wrap gap-3 pl-2 pr-4 mx-auto pb-6">
              <Avatar
                onClick={() => {
                  setFillter("");
                  setDropDownShow(false);
                }}
                title="normal"
                size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                src={
                  <img
                    src={`https://wallpapercave.com/uwp/uwp4324894.png`}
                    alt=""
                    style={{ cursor: "pointer", transform: "scaleX(-1)" }}
                  />
                }
              />
              <Avatar
                onClick={() => {
                  setFillter("grayscale(100%)");
                  setDropDownShow(false);
                }}
                title="grayscale"
                size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                src={
                  <img
                    src={`https://wallpapercave.com/uwp/uwp4324894.png`}
                    alt=""
                    style={{
                      filter: "grayscale(100%)",
                      cursor: "pointer",
                      transform: "scaleX(-1)",
                    }}
                  />
                }
              />
              <Avatar
                onClick={() => {
                  setFillter("blur(1.5px)");
                  setDropDownShow(false);
                }}
                title="blur"
                size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                src={
                  <img
                    src={`https://wallpapercave.com/uwp/uwp4324894.png`}
                    alt=""
                    style={{
                      filter: "blur(1.5px)",
                      cursor: "pointer",
                      transform: "scaleX(-1)",
                    }}
                  />
                }
              />
              <Avatar
                onClick={() => {
                  setFillter("brightness(200%)");
                  setDropDownShow(false);
                }}
                title="brightness"
                size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                src={
                  <img
                    src={`https://wallpapercave.com/uwp/uwp4324894.png`}
                    alt=""
                    style={{
                      filter: "brightness(200%)",
                      cursor: "pointer",
                      transform: "scaleX(-1)",
                    }}
                  />
                }
              />

              <Dropdown
                visible={DropDownShow}
                trigger={["click"]}
                menu={{
                  items,
                }}
                placement="top"
              >
                <Avatar
                  onClick={() => {
                    setDropDownShow(!DropDownShow);
                    setFillter("");
                  }}
                  size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                >
                  <MdEditRoad />
                </Avatar>
              </Dropdown>

              <Avatar
                onClick={() => {
                  setFillter("contrast(200%)");
                  setDropDownShow(false);
                }}
                title="contrast"
                size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                src={
                  <img
                    src={`https://wallpapercave.com/uwp/uwp4324894.png`}
                    alt=""
                    style={{
                      filter: "contrast(200%)",
                      cursor: "pointer",
                      transform: "scaleX(-1)",
                    }}
                  />
                }
              />
              <Avatar
                onClick={() => {
                  setFillter("hue-rotate(70deg)");
                  setDropDownShow(false);
                }}
                title="hue"
                size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                src={
                  <img
                    src={`https://wallpapercave.com/uwp/uwp4324894.png`}
                    alt=""
                    style={{
                      filter: "hue-rotate(70deg)",
                      cursor: "pointer",
                      transform: "scaleX(-1)",
                    }}
                  />
                }
              />

              <Avatar
                onClick={() => {
                  setFillter("saturate(200%)");
                  setDropDownShow(false);
                }}
                title="saturate"
                size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                src={
                  <img
                    src={`https://wallpapercave.com/uwp/uwp4324894.png`}
                    alt=""
                    style={{
                      filter: "saturate(200%)",
                      cursor: "pointer",
                      transform: "scaleX(-1)",
                    }}
                  />
                }
              />
              <Avatar
                onClick={() => {
                  setFillter("sepia(100%)");
                  setDropDownShow(false);
                }}
                title="sepia"
                size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                src={
                  <img
                    src={`https://wallpapercave.com/uwp/uwp4324894.png`}
                    alt=""
                    style={{
                      filter: "sepia(100%)",
                      cursor: "pointer",
                      transform: "scaleX(-1)",
                    }}
                  />
                }
              />
            </div>
          </div>
        ) : (
          // </div>
          <div className="absolute bottom-6 w-full   md:w-[50%]  flex justify-center  items-center">
            {isRecording ? (
              <div
                style={{
                  marginBottom: "-8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseDown={() => {
                  setIsMouseDown(true);
                }}
                onMouseUp={() => {
                  setIsMouseDown(false);
                  stopVideoRecording();
                }}
                onClick={() => !state && TakePhoto()}
              >
                <FaCircle style={{ position: "absolute" }} size={16} />
                <Progress
                  type="circle"
                  percent={(recordingProgress / 15) * 100}
                  size={42}
                  className="cursor-pointer "
                />
              </div>
            ) : (
              <BsRecordCircle
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  marginBottom: !isRecording && "28px",
                  zIndex: "99999",
                }}
                size={40}
                onMouseDown={() => {
                  setIsMouseDown(true);
                }}
                onMouseUp={() => {
                  setIsMouseDown(false);
                  stopVideoRecording();
                }}
                onClick={() => !state && TakePhoto()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateMessage;
