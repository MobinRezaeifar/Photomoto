import React, { useState } from "react";
import axios from "axios";
import Video from "twilio-video";

function VideoCall() {
  const [room, setRoom] = useState(null);
  const [identity, setIdentity] = useState("");
  const [token, setToken] = useState("");

  const handleJoinRoom = async () => {
    try {
      const response = await axios.post("http://localhost:5001/token", {
        identity,
      });
      setToken(response.data.token);

      Video.connect(response.data.token, { name: "my-room" }).then((room) => {
        setRoom(room);
      });
    } catch (error) {
      console.error("Error joining the room:", error);
    }
  };

  return (
    <div>
      <h1>Video Chat</h1>
      <input
        type="text"
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
        placeholder="Enter your identity"
      />
      <button onClick={handleJoinRoom}>Join Room</button>
      {room && (
        <div>
          <h2>Connected to {room.name}</h2>
          {room.participants.map((participant) => (
            <div key={participant.sid}>{participant.identity}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoCall;
