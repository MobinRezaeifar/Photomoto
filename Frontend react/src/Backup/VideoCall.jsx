import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./VideoCall.css";

const socket = io.connect("http://localhost:5001");

function VideoCall() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <>
      <h1 className="text-center text-white">Zoomish</h1>
      <div className="container mx-auto p-4">
        <div className="video-container flex justify-around mb-4">
          <div className="video">
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="w-72"
              />
            )}
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <video playsInline ref={userVideo} autoPlay className="w-72" />
            ) : null}
          </div>
        </div>
        <div className="myId mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <CopyToClipboard text={me}>
            <button className="w-full p-2 mb-2 bg-blue-500 text-white rounded">
              Copy ID
            </button>
          </CopyToClipboard>
          <input
            type="text"
            placeholder="ID to call"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <div className="call-button flex justify-center">
            {callAccepted && !callEnded ? (
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={leaveCall}
              >
                End Call
              </button>
            ) : (
              <button
                className="p-2 bg-green-500 text-white rounded"
                onClick={() => callUser(idToCall)}
              >
                Call
              </button>
            )}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller text-center">
              <h1>{name} is calling...</h1>
              <button
                className="p-2 bg-blue-500 text-white rounded"
                onClick={answerCall}
              >
                Answer
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default VideoCall;
