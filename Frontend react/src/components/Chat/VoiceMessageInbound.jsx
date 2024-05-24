import React, { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import { FaPause, FaPlay } from "react-icons/fa";
import { MdOutlineDownloading } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteMessages, DownloadMedia } from "../../Redux/action";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const VoiceMessageInbound = ({ data, MainUserImg, MessageFontSize }) => {
  const [ShowMessageMenu, setShowMessageMenu] = useState(false);
  const [selectVoice, setselectVoice] = useState("");
  const audio = useRef();
  const [PlayIcon, setPlayIcon] = useState(<FaPlay />);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const baseUrlDotenet = useSelector((state) => state.baseUrlDotenet);
  const navigate = useNavigate();
  const PlayVoice = (path) => {
    if (path == selectVoice) {
      if (audio.current.paused) {
        audio.current.play();
        setPlayIcon(<FaPause />);
      } else {
        audio.current.pause();
        setPlayIcon(<FaPlay />);
      }
    }

    function audioEnded() {
      setPlayIcon(<FaPlay />);
    }

    audio.current.onended = audioEnded;
  };
  useEffect(() => {
    const updateProgress = () => {
      const duration = audio.current.duration;
      const currentTime = audio.current.currentTime;
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);
    };

    audio.current.addEventListener("timeupdate", updateProgress);
    return () => {
      if (audio.current) {
        audio.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);
  const heights = useRef(
    Array.from({ length: 40 }, () => Math.floor(Math.random() * 20) + 5)
  );
  const [state, setstate] = useState(false);
  return (
    <motion.div
      initial={{ opacity: state ? 1 : 0, x: 0 }}
      animate={{ opacity: state ? 0 : 1, x: 0 }}
      transition={{ duration: 0.5 }}
      class="flex items-start gap-2.5"
      style={{ direction: "rtl" }}
    >
      <img
        onClick={() => navigate(`${data.sender}`)}
        class="md:w-12 w-10 h-10 md:h-12 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer"
        src={MainUserImg}
        alt=""
      />

      <div class="flex flex-col gap-1">
        <div class="flex items-center space-x-2 rtl:space-x-reverse gap-1">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {data.sender}
          </span>
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            {data.time}
          </span>
        </div>
        <audio
          src={
            `${baseUrlDotenet}api/FileManager/downloadfile?FileName=` +
            data.media
          }
          ref={audio}
          className="hidden"
        ></audio>
        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-500">
          <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              className="focus:bg-gray-600 focus:rounded-full p-2"
              style={{
                fontSize: "20px",
                border: "none",
                outline: "none",
                marginLeft: "10px",
              }}
              onClick={() => {
                setselectVoice(data.file);
                PlayVoice(data.file);
              }}
            >
              {PlayIcon}
            </button>

            <div style={{ direction: "rtl" }}>
              <svg
                className="w-[145px] md:w-[185px] md:h-[40px]"
                aria-hidden="true"
                viewBox="0 0 185 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {heights.current.map((height, index) => {
                  const handleClick = () => {
                    const duration = audio.current.duration;
                    const currentTime =
                      (index * duration) / heights.current.length;
                    audio.current.currentTime = currentTime;
                  };
                  const x = 185 - (index + 1) * 4.625;
                  return (
                    <rect
                      key={index}
                      x={x}
                      y={15.5 - height / 3.2}
                      width="3"
                      height={height}
                      rx="1.5"
                      fill={
                        progress > index * 2.5 ? "#1C64F2" : "rgb(75 85 99)"
                      }
                      onClick={handleClick}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}
              </svg>
            </div>

            <span class="inline-flex self-center items-center p-2 text-sm font-medium text-gray-900 dark:text-white">
              {data.duration}
            </span>
          </div>
        </div>
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Delivered
        </span>
      </div>
      <div
        className={`flex items-center  justify-center self-center relative `}
        onMouseLeave={() => {
          setShowMessageMenu(false);
        }}
      >
        <button
          onClick={() => {
            setShowMessageMenu(!ShowMessageMenu);
          }}
          class={`p-2 ml-2 text-sm font-medium text-center text-gray-900 rounded-lg focus:outline-none dark:text-white focus:ring-4 ring-[#393939]`}
          type="button"
        >
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 4 15"
          >
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          </svg>
        </button>
        {ShowMessageMenu && (
          <div className={``}>
            <ul
              className={`${MessageFontSize} bg-transparent rounded-lg flex flex-col gap-1`}
            >
              <motion.li
                onClick={() => {
                  dispatch(DownloadMedia(data.media));
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.25 }}
                className=" p-2 text-center  cursor-pointer"
              >
                <MdOutlineDownloading color="" size={25} />
              </motion.li>
              <motion.li
                onClick={async () => {
                  await setstate(true);
                  await dispatch(deleteMessages(data.id));
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.25 }}
                className=" p-2 text-center  cursor-pointer"
              >
                <RiDeleteBin6Fill color="" size={22} />
              </motion.li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceMessageInbound;
