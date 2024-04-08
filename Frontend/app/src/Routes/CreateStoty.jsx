import React, { useRef, useState } from "react";

function CreateStoty() {
  const videoRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");
    setImageUrl(imageUrl);
  };

  return (
    <div>
      <button onClick={handleStartCamera}>Start Camera</button>
      <br />
      <video ref={videoRef} width="400" height="300" autoPlay></video>
      <br />
      <button onClick={handleCapture}>Capture</button>
      <br />
      {imageUrl && <img src={imageUrl} alt="Captured" />}
    </div>
  );
}

export default CreateStoty;
