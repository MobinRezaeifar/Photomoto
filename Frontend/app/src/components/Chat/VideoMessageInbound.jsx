import React from "react";
import { useState } from "react";
import { IoCopy } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import { MdOutlineDownloading } from "react-icons/md";
import { deleteMessages, DownloadMedia } from "../../Redux/action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const VideoMessageInbound = ({ data, MainUserImg, MessageFontSize }) => {
  const [ShowMessageMenu, setShowMessageMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
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
        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-500">
          <p
            title={data.media}
            class={`text-md font-normal text-gray-900 dark:text-white`}
          >
            {(() => {
              let parts = data.media.split(".");
              return data.media.length > 20
                ? data.media.substring(0, 10) + "..." + parts.pop()
                : data.media;
            })()}
          </p>
          <div class="group relative my-2.5">
            <video
              controls
              autoPlay
              muted
              loop
              src={
                "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                data.media
              }
              class="rounded-lg"
            />
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
                onClick={() => {
                  dispatch(deleteMessages(data.id));
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.25 }}
                className=" p-2 text-center  cursor-pointer"
              >
                <RiDeleteBin6Fill color="" size={22} />
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.25 }}
                className=" p-2 text-center  cursor-pointer"
              >
                <FiEdit size={22} color="" />
              </motion.li>
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoMessageInbound;
