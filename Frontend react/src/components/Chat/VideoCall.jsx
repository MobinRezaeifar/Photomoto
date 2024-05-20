import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./VideoCall.css";
import { useSelector } from "react-redux";

const socket = io.connect("http://localhost:5001");

function VideoCall() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // Redux selectors
  const TargetUserIdVideoCall = useSelector(
    (state) => state.MainUserIdVideoCall
  );
  const MainUserIdVideoCall = useSelector(
    (state) => state.TargetUserIdVideoCall
  );

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      console.log("Socket me ID:", id);
      setMe(id);
    });

    socket.on("callUser", (data) => {
      console.log("Receiving call from:", data.from);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    console.log("Calling user ID:", id);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      console.log("Sending signal data to user:", TargetUserIdVideoCall);
      socket.emit("callUser", {
        userToCall: TargetUserIdVideoCall,
        signalData: data,
        from: MainUserIdVideoCall,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      console.log("Call accepted with signal:", signal);
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    console.log("Answering call from:", caller);
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      console.log("Answering with signal data to:", caller);
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    console.log("Ending call");
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <>
      <h1 className="text-center text-white">Zoomish</h1>
      <div className="container mx-auto p-4">
        <div className="flex justify-center space-x-4">
          <div className="w-72">
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="w-full"
              />
            )}
          </div>
          <div className="w-72">
            {callAccepted && !callEnded ? (
              <video playsInline ref={userVideo} autoPlay className="w-full" />
            ) : null}
          </div>
        </div>
        <div className="my-4 text-center">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              className="p-2 border border-gray-300 rounded-md w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <CopyToClipboard text={me}>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4">
              Copy ID
            </button>
          </CopyToClipboard>

          <div>
            {callAccepted && !callEnded ? (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md"
                onClick={leaveCall}
              >
                End Call
              </button>
            ) : (
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-md"
                onClick={() => callUser(TargetUserIdVideoCall)}
              >
                Call
              </button>
            )}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="text-center">
              <h1>{name} is calling...</h1>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
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
