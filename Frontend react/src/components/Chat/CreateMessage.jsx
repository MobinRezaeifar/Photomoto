import React, { useRef, useState, useEffect } from "react";
import { Progress } from "antd";
import { FaArrowCircleLeft, FaCircle } from "react-icons/fa";
import { BsRecordCircle } from "react-icons/bs";
import axios from "axios";
import isEqual from "lodash.isequal";
import { useDispatch, useSelector } from "react-redux";
import moment from "jalali-moment";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { AddMessages, fetchConnection } from "../../Redux/action";

function CreateMessage() {
  const videoRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [state, setstate] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [mediaResult, setmediaResult] = useState({});
  let navigate = useNavigate();
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
        await axios.post(
          "http://localhost:5221/api/FileManager/uploadfile",
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
      }
      setTimeout(() => {
        setmediaResult({
          fileName,
          type: blob.type,
          size: blob.size ? blob.size / (1024 * 1024) : 0,
        });
      }, 1000);
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
        setTimeout(() => {
          setmediaResult({
            fileName,
            type: blob.type,
            size: blob.size ? blob.size / (1024 * 1024) : 0,
          });
        }, 1000);
        try {
          await axios.post(
            "http://localhost:5221/api/FileManager/uploadfile",
            form,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Photo uploaded successfully!");
        } catch (error) {
          console.error("Error uploading photo:", error);
        }
      }, "image/png");
    }
  };
  const now = Date.now();

  const dispatch = useDispatch();

  const ShareStory = () => {
    if (!isEqual(mediaResult, {})) {
      dispatch(
        AddMessages({
          media: mediaResult.fileName,
          sender: decryptAES(sessionStorage.getItem("u")),
          recipient: SelectUserChat,
          relationship: `${decryptAES(
            sessionStorage.getItem("u")
          )},${SelectUserChat}`,
          type: mediaResult.type,
          time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
          size: mediaResult.size,
        })
      );
      setmediaResult({});
      navigate("/photomoto");
    }
  };
  useEffect(() => {
    if (!SelectUserChat) {
      navigate("/photomoto");
    }
    dispatch({
      type: "ISSUE",
      payload: "direct",
    });
    dispatch(fetchConnection());
  });
  return (
    <div className="flex justify-center h-screen w-screen flex items">
      <div className="w-full  md:w-[50%] bg-base-300 rounded-2xl">
        <div className="z-50 w-full  md:w-[50%] absolute flex justify-between p-4">
          <FaArrowCircleLeft
            size={30}
            className=" cursor-pointer"
            onClick={() => {
              setmediaResult({});
              navigate("/photomoto");
            }}
          />
          <div className="flex items-center justify-center gap-2">
            <button
              className="btn glass bg-red-700 text-white"
              style={{ transform: "scale(0.9)" }}
              onClick={() => {
                setmediaResult({});
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
              if (mediaResult.type.startsWith("video")) {
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
                      }}
                      autoPlay
                      loop
                      src={`http://localhost:5221/api/FileManager/downloadfile?FileName=${mediaResult.fileName}`}
                      alt=""
                    />
                  </div>
                );
              }
              if (mediaResult.type.startsWith("image")) {
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
                      }}
                      src={`http://localhost:5221/api/FileManager/downloadfile?FileName=${mediaResult.fileName}`}
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
        {isEqual(mediaResult, {}) && (
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
