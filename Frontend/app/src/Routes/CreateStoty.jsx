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

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");
    setImageUrl(imageUrl);
  };

  const buttonRef = useRef(null);
  const [holdTimer, setHoldTimer] = useState(null);

  const handleClick = () => {
    console.log("Button clicked!");
  };

  const handleHold = () => {
    console.log("Button held!");
    setHoldTimer(null); // Clear the timer if hold is detected
  };

  useEffect(() => {
    const button = buttonRef.current;

    const handleMouseDown = () => {
      setHoldTimer(setTimeout(handleHold, 1000)); // Start timer after 1 second of press (adjust as needed)
    };

    const handleMouseUp = () => {
      clearTimeout(holdTimer);
    };
    if (button) {
      button.addEventListener("mousedown", handleMouseDown);
      button.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (button) {
        button.removeEventListener("mousedown", handleMouseDown);
        button.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, []);

  return (
    <div className="flex justify-center h-screen w-screen">
      <div className="w-full  md:w-[50%] bg-base-300 rounded-2xl">
        <div>
          <video ref={videoRef} className="w-full h-screen" autoPlay></video>
        </div>
        <div className="absolute bottom-6 w-full   md:w-[50%]  flex justify-center">
          <BsRecordCircle
            size={40}
            className="cursor-pointer"
            ref={buttonRef}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateStoty;
