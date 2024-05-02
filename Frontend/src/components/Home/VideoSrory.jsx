import React, { useEffect } from "react";
import { useState } from "react";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";

const VideoSrory = ({ data, show, currentSlide, carouselRef }) => {
  const [SoundVideo, setSoundVideo] = useState(false);
  useEffect(() => {
    if (!show) {
      setSoundVideo(false);
      carouselRef.current.goTo(0);
    }
  });
  useEffect(() => {
    setSoundVideo(false);
  }, [currentSlide]);
  return (
    <div>
      <div className="absolute bottom-0 right-0 p-2" style={{ zIndex: "9990" }}>
        {SoundVideo ? (
          <div
            className="bg-gray-400 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
            onClick={() => setSoundVideo(false)}
          >
            <HiMiniSpeakerXMark size={30} />
          </div>
        ) : (
          <div
            className="bg-gray-400 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
            onClick={() => setSoundVideo(true)}
          >
            <HiMiniSpeakerWave size={30} color="" />
          </div>
        )}
      </div>
      <video
        src={data.media}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: data.filter,
          transform: "scaleX(-1)",
        }}
        autoPlay
        loop
        muted={SoundVideo ? false : true}
      />
    </div>
  );
};

export default VideoSrory;
