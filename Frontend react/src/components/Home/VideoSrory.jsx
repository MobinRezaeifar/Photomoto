/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useState } from "react";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";

const VideoSrory = ({ data, show, currentSlide, carouselRef }) => {
  const [SoundVideo, setSoundVideo] = useState(false);
  const [showSoundIcon, setshowSoundIcon] = useState("hidden");
  useEffect(() => {
    if (!show) {
      setSoundVideo(false);
      carouselRef.current.goTo(0);
    }
  });
  useEffect(() => {
    setSoundVideo(false);
  }, [currentSlide]);

  useEffect(() => {
    setTimeout(() => {
      setshowSoundIcon("hidden");
    }, 2000);
  }, [SoundVideo]);

  return (
    <div className="flex items-center justify-center">
      <div className={`${showSoundIcon} p-2`} style={{ zIndex: "9990" }}>
        {!SoundVideo ? (
          <div
            className=" rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
            onClick={() => setSoundVideo(false)}
          >
            <HiMiniSpeakerXMark size={30} />
          </div>
        ) : (
          <div
            className=" rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
            onClick={() => setSoundVideo(true)}
          >
            <HiMiniSpeakerWave size={30} color="" />
          </div>
        )}
      </div>
      <video
        onClick={() => {
          setshowSoundIcon("absolute");
          setSoundVideo(!SoundVideo);
        }}
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
