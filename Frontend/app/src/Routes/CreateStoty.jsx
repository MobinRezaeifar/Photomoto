import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { BsCursor, BsRecordCircle } from "react-icons/bs";

function CreateStoty() {
  const videoRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [CameraStatus, setCameraStatus] = useState(false);

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

  const TakePhoto = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");
    setImageUrl(imageUrl);
    handleDownload(imageUrl);
  };

  const handleDownload = (imageUrl) => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = Date.now() + ".png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [state, setstate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isMouseDown) {
        setstate(true);
        console.log("نگه داشتن");
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
      setstate(false);
    };
  }, [isMouseDown]);

  
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
        <div className="absolute bottom-6 w-full   md:w-[50%]  flex justify-center">
          <BsRecordCircle
            size={40}
            className="cursor-pointer"
            onMouseDown={() => {
              setIsMouseDown(true);
            }}
            onMouseUp={() => {
              setIsMouseDown(false);
            }}
            onClick={() => !state && TakePhoto()}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateStoty;
