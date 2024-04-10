import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { BsCursor, BsRecordCircle } from "react-icons/bs";
import { Progress } from "antd";
import { FaCircle } from "react-icons/fa";

function CreateStoty() {
  const videoRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [state, setstate] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isMouseDown) {
        setstate(true);
        startVideoRecording();
      }
    }, 1000);

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
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };
    StartCamera();
  }, []);

  // Handele Picture

  const TakePhoto = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");
    handleDownloadPicture(imageUrl);
  };

  const handleDownloadPicture = (imageUrl) => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = Date.now() + ".png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // \\

  // Handele Video
  const startVideoRecording = () => {
    const stream = videoRef.current.captureStream();
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder); // تنظیم mediaRecorder

    const chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      handleDownloadVideo(url);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopVideoRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleDownloadVideo = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  // \\
  return (
    <div className="flex justify-center h-screen w-screen">
      <div className="w-full  md:w-[50%] bg-base-300 rounded-2xl">
        <div>
          <video
            style={{ transform: "scaleX(-1)" }}
            ref={videoRef}
            className="w-full h-screen"
            autoPlay
          ></video>
        </div>
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
                percent={10}
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
      </div>
    </div>
  );
}

export default CreateStoty;
