/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { Avatar, Progress } from "antd";
import { FaCircle } from "react-icons/fa";
import { BsRecordCircle } from "react-icons/bs";
import axios from "axios";
import isEqual from "lodash.isequal";
import { AntDesignOutlined } from "@ant-design/icons";

function CreateStoty() {
  const videoRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [state, setstate] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [mediaResult, setmediaResult] = useState({});
  const [showFilterList, SetshowFilterList] = useState(false);
  const [Fillter, setFillter] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isMouseDown) {
        setstate(true);
        startVideoRecording();
      }
    }, 200);

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
        await axios.post("http://localhost:5000/api/upload", form, {
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
          await axios.post("http://localhost:5000/api/upload", form, {
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

  return (
    <div className="flex justify-center h-screen w-screen">
      <div className="w-full  md:w-[50%] bg-base-300 rounded-2xl">
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
                        filter: Fillter,
                      }}
                      autoPlay
                      loop
                      src={`http://localhost:5000/api/files/${mediaResult.fileName}`}
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
                        filter: Fillter,
                      }}
                      src={`http://localhost:5000/api/files/${mediaResult.fileName}`}
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
                ></video>
              );
            }
          })()}
        </div>
        {showFilterList ? (
          <div className="absolute bottom-1  w-full pl-4  md:w-[50%] flex justify-center items-center overflow-x-auto pb-6">
            <div className="flex flex-no-wrap gap-3">
              <Avatar
                onClick={() => setFillter("grayscale(100%)")}
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
                onClick={() => setFillter("blur(1.5px)")}
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
                onClick={() => setFillter("brightness(200%)")}
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
              <Avatar
                onClick={() => setFillter("")}
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
                onClick={() => setFillter("contrast(200%)")}
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
                onClick={() => setFillter("hue-rotate(70deg)")}
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
                onClick={() => setFillter("invert(100%)")}
                title="invert"
                size={{ xs: 40, sm: 40, md: 40, lg: 54, xl: 60, xxl: 60 }}
                src={
                  <img
                    src={`https://wallpapercave.com/uwp/uwp4324894.png`}
                    alt=""
                    style={{
                      filter: "invert(100%)",
                      cursor: "pointer",
                      transform: "scaleX(-1)",
                    }}
                  />
                }
              />
              <Avatar
                onClick={() => setFillter("saturate(200%)")}
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
                onClick={() => setFillter("sepia(100%)")}
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

export default CreateStoty;
