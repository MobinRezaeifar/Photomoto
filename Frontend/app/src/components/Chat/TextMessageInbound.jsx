import React from "react";
import { useState } from "react";
import { IoCopy } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import {
  deleteMessages,
  fetchMessages,
  patchMessages,
  updateMessages,
} from "../../Redux/action";
import { useNavigate } from "react-router-dom";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { RxCrossCircled } from "react-icons/rx";
import { GoCheckCircle } from "react-icons/go";
import axios from "axios";

const TextMessageInbound = ({ data, MainUserImg, MessageFontSize }) => {
  const dispatch = useDispatch();
  const [ShowMessageMenu, setShowMessageMenu] = useState(false);
  const navigate = useNavigate();
  const [state, setstate] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [EditState, setEditState] = useState(false);
  const [EditText, setEditText] = useState(data.media);

  return (
    <motion.div
      onMouseLeave={() => {
        setEditState(false);
        setEditText(data.media);
      }}
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
      <div class="flex flex-col gap-1 w-full max-w-[320px]">
        <div class="flex items-center space-x-2 rtl:space-x-reverse gap-1">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {data.sender}
          </span>
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            {data.time}
          </span>
        </div>
        <div class="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-500">
          {data.media.length > 30 ? (
            <textarea
              class={`${MessageFontSize} font-normal  text-white bg-transparent`}
            >
              {data.media}
            </textarea>
          ) : (
            <p class={`${MessageFontSize} font-normal text-white`}>
              {EditState ? (
                <div>
                  <input
                    onChange={(e) => {
                      setEditText(e.target.value);
                    }}
                    value={EditText}
                    autoFocus
                    type="text"
                    className="bg-gray-400 outline-none shadow-2xl px-2 py-1 text-xl rounded-e-xl rounded-es-xl"
                  />
                </div>
              ) : (
                data.media
              )}
            </p>
          )}
        </div>
        <div className="flex justify-between">
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Delivered
          </span>
          {EditState && (
            <div className=" flex items-center justify-start gap-1 pl-2 pt-1">
              <RxCrossCircled
                onClick={() => {
                  setEditState(false);
                  setEditText(data.media);
                }}
                size={24}
                color="#820014"
                className="cursor-pointer"
              />
              {EditText && (
                <GoCheckCircle
                  onClick={async () => {
                    dispatch(
                      patchMessages(data.id, {
                        id: data.id,
                        media: EditText,
                      })
                    );
                    setEditState(false);
                    setShowMessageMenu(false);
                  }}
                  size={24}
                  color="#135200"
                  className="cursor-pointer"
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className={`flex items-center  justify-center self-center relative `}
        onMouseLeave={() => {
          setShowMessageMenu(false);
          setCopySuccess(false);
          setEditText(data.media);
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
                id="copyCheck"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(data.media);
                    setCopySuccess(true);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.25 }}
                className=" p-2 text-center  cursor-pointer"
              >
                {copySuccess ? (
                  <LuCopyCheck color="" size={22} />
                ) : (
                  <LuCopy color="" size={22} />
                )}
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
              <motion.li
                onClick={() => {
                  setEditState(true);
                  setShowMessageMenu(false);
                }}
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

export default TextMessageInbound;
