import React from "react";
import { useState } from "react";
import { IoCopy } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { motion } from "framer-motion";
const VoiceMessageInbound = ({ data, MainUserImg, MessageFontSize }) => {
  const [ShowMessageMenu, setShowMessageMenu] = useState(false);

  return (
    <div class="flex items-start gap-2.5" style={{ direction: "rtl" }}>
      <img
        class="lg:w-11 w-9 h-9 lg:h-11 rounded-full"
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
        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
          <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              type="button"
            >
              <svg
                class="w-4 h-4 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 12 16"
              >
                <path d="M3 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm7 0H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z" />
              </svg>
            </button>
            <svg
              class="w-[145px] md:w-[185px] md:h-[40px]"
              aria-hidden="true"
              viewBox="0 0 185 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="17"
                width="3"
                height="6"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="7"
                y="15.5"
                width="3"
                height="9"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="21"
                y="6.5"
                width="3"
                height="27"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="14"
                y="6.5"
                width="3"
                height="27"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="28"
                y="3"
                width="3"
                height="34"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="35"
                y="3"
                width="3"
                height="34"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="42"
                y="5.5"
                width="3"
                height="29"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="49"
                y="10"
                width="3"
                height="20"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="56"
                y="13.5"
                width="3"
                height="13"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="63"
                y="16"
                width="3"
                height="8"
                rx="1.5"
                fill="#6B7280"
                class="dark:fill-white"
              />
              <rect
                x="70"
                y="12.5"
                width="3"
                height="15"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="77"
                y="3"
                width="3"
                height="34"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="84"
                y="3"
                width="3"
                height="34"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="91"
                y="0.5"
                width="3"
                height="39"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="98"
                y="0.5"
                width="3"
                height="39"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="105"
                y="2"
                width="3"
                height="36"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="112"
                y="6.5"
                width="3"
                height="27"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="119"
                y="9"
                width="3"
                height="22"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="126"
                y="11.5"
                width="3"
                height="17"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="133"
                y="2"
                width="3"
                height="36"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="140"
                y="2"
                width="3"
                height="36"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="147"
                y="7"
                width="3"
                height="26"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="154"
                y="9"
                width="3"
                height="22"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="161"
                y="9"
                width="3"
                height="22"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="168"
                y="13.5"
                width="3"
                height="13"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="175"
                y="16"
                width="3"
                height="8"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect
                x="182"
                y="17.5"
                width="3"
                height="5"
                rx="1.5"
                fill="#E5E7EB"
                class="dark:fill-gray-500"
              />
              <rect x="66" y="16" width="8" height="8" rx="4" fill="#1C64F2" />
            </svg>
            <span class="inline-flex self-center items-center p-2 text-sm font-medium text-gray-900 dark:text-white">
              3:42
            </span>
          </div>
        </div>
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Delivered
        </span>
      </div>
      <div
        className={`flex items-center  justify-center self-center relative `}
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.25 }}
                className=" p-2 text-center  cursor-pointer"
              >
                <IoCopy color="" size={22} />
              </motion.li>
              <motion.li
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
    </div>
  );
};

export default VoiceMessageInbound;
