import React from "react";
import { useState } from "react";
import { IoCopy } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { motion } from "framer-motion";
const TextMessageOutbound = ({ data, MainUserImg, MessageFontSize }) => {
  const [ShowMessageMenu, setShowMessageMenu] = useState(false);

  return (
    <div class="flex items-start gap-2.5">
      <img
        class="lg:w-11 w-9 h-9 lg:h-11 rounded-full"
        src={MainUserImg}
        alt=""
      />
      <div class="flex flex-col gap-1 w-full max-w-[320px]">
        <div class="flex items-center space-x-2 rtl:space-x-reverse gap-1">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {data.sender}
          </span>
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            {data.time}
          </span>
        </div>
        <div class="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-600">
          {data.media.length > 30 ? (
            <textarea
              class={`${MessageFontSize} font-normal  text-white bg-transparent`}
            >
              {data.media}
            </textarea>
          ) : (
            <p class={`${MessageFontSize} font-normal text-white`}>
              {data.media}
            </p>
          )}
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
          class={`p-2 mr-2 text-sm font-medium text-center text-gray-900 rounded-lg focus:outline-none dark:text-white focus:ring-4 ring-[#393939]`}
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.25 }}
                className=" p-2 text-center  cursor-pointer"
              >
                <IoCopy color="" size={22} />
              </motion.li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextMessageOutbound;
