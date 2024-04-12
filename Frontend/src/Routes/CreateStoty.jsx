import React, { useRef, useState, useEffect } from "react";
import { Progress } from "antd";
import { FaCircle } from "react-icons/fa";
import { BsRecordCircle } from "react-icons/bs";
import axios from "axios";
function CreateStoty() {
  const videoRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [state, setstate] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

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
      const blob = new Blob(chunks, { type: "video/webm" });
      var form = new FormData();
      form.append("file", blob, Date.now() + ".mp4");
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
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
  
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
      canvas.toBlob(async (blob) => {
        var form = new FormData();
        form.append("file", blob, Date.now() + ".png");
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
      }, 'image/png');
    }
  };
  

  return (
    <div className="flex justify-center h-screen w-screen">
      <div className="w-full  md:w-[50%] bg-base-300 rounded-2xl">
        <div>
          <video
            style={{ transform: "scaleX(-1)" }}
            ref={videoRef}
            className="w-full h-screen"
            autoPlay
            muted
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
      </div>
    </div>
  );
}

export default CreateStoty;
