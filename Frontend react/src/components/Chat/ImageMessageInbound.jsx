/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React from "react";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import isEqual from "lodash/isEqual";
import {
  deleteMessages,
  DownloadMedia,
  patchMessages,
} from "../../Redux/action";
import { useNavigate } from "react-router-dom";
import { MdOutlineDownloading } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { GoCheckCircle } from "react-icons/go";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Image, Space } from "antd";
import axios from "axios";
import { size } from "lodash";
import { useSelector } from "react-redux";
const ImageMessageInbound = ({ data, MainUserImg, MessageFontSize }) => {
  const dispatch = useDispatch();
  const [ShowMessageMenu, setShowMessageMenu] = useState(false);
  const navigate = useNavigate();
  const [state, setstate] = useState(false);
  const [EditStatus, setEditStatus] = useState(false);
  const [EditFile, setEditFile] = useState({});
  const { Dragger } = Upload;
  const baseUrlDotenet = useSelector((state) => state.baseUrlDotenet);
  const props = {
    name: "file",
    accept: "image/*,video/*",
    multiple: true,
    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        var form = new FormData();
        form.append("file", info.file.originFileObj);
        await axios.post(`${baseUrlDotenet}api/FileManager/uploadfile`, form);
        setEditFile(info.file.originFileObj);
      }
      if (status === "done") {
      } else if (status === "error") {
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  let parts = data.media.split(".");

  return (
    <motion.div
      initial={{ opacity: state ? 1 : 0, x: 0 }}
      animate={{ opacity: state ? 0 : 1, x: 0 }}
      transition={{ duration: 0.5 }}
      class="flex items-start gap-2.5 "
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
          <span
            title={data.media}
            class={`text-md font-normal text-gray-900 dark:text-white`}
          >
            {!EditStatus &&
              (data.media.length > 20
                ? data.media.substring(0, 10) + "..." + parts.pop()
                : data.media)}
          </span>
          {(() => {
            if (EditStatus) {
              if (isEqual(EditFile, {})) {
                return (
                  <Dragger
                    {...props}
                    style={{
                      width: "100%",
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text " style={{ color: "white" }}>
                      Click or drag file to this area to upload
                    </p>
                  </Dragger>
                );
              } else {
                if (EditFile.type.startsWith("video")) {
                  return (
                    <video
                      controls
                      autoPlay
                      style={{ width: "100%" }}
                      src={
                        `${baseUrlDotenet}api/FileManager/downloadfile?FileName=` +
                        EditFile.name
                      }
                    ></video>
                  );
                }
                return (
                  <Image
                    style={{ width: "100%" }}
                    src={
                      `${baseUrlDotenet}api/FileManager/downloadfile?FileName=` +
                      EditFile.name
                    }
                    preview={{
                      toolbarRender: (
                        _,
                        {
                          transform: { scale },
                          actions: {
                            onFlipY,
                            onFlipX,
                            onRotateLeft,
                            onRotateRight,
                            onZoomOut,
                            onZoomIn,
                          },
                        }
                      ) => (
                        <Space size={12} className="toolbar-wrapper">
                          <DownloadOutlined />
                          <SwapOutlined rotate={90} onClick={onFlipY} />
                          <SwapOutlined onClick={onFlipX} />
                          <RotateLeftOutlined onClick={onRotateLeft} />
                          <RotateRightOutlined onClick={onRotateRight} />
                          <ZoomOutOutlined
                            disabled={scale === 1}
                            onClick={onZoomOut}
                          />
                          <ZoomInOutlined
                            disabled={scale === 50}
                            onClick={onZoomIn}
                          />
                        </Space>
                      ),
                    }}
                  />
                );
              }
            } else {
              return (
                <div class="group relative my-2.5">
                  <div class="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <div className="flex flex-col items-center shadow-xl">
                      <button
                        onClick={() => {
                          dispatch(DownloadMedia(data.media));
                        }}
                        data-tooltip-target="download-image"
                        class="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                      >
                        <svg
                          class="w-5 h-5 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 18"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                          />
                        </svg>
                      </button>
                      {data.size.toFixed(2) + "MB"}
                    </div>
                    <div
                      id="download-image"
                      role="tooltip"
                      class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                    >
                      Download image
                      <div class="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  </div>
                  <img
                    src={
                      `${baseUrlDotenet}api/FileManager/downloadfile?FileName=` +
                      data.media
                    }
                    alt=""
                    class="rounded-lg"
                  />
                </div>
              );
            }
          })()}
        </div>
        <div className="flex justify-between">
          {/* <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Delivered
          </span> */}
          {EditStatus && (
            <div className=" flex items-center justify-start gap-1 pl-2 pt-1">
              <RxCrossCircled
                onClick={() => {
                  setEditStatus(false);
                  setEditFile({});
                }}
                size={24}
                color="#820014"
                className="cursor-pointer"
              />
              {!isEqual(EditFile, {}) && (
                <GoCheckCircle
                  onClick={async () => {
                    dispatch(
                      patchMessages(data.id, {
                        id: data.id,
                        media: EditFile.name,
                        size: EditFile.size ? EditFile.size / (1024 * 1024) : 0,
                        type: EditFile.type,
                      })
                    );
                    setEditFile({});
                    setEditStatus(false);
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
              <motion.li
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.25 }}
                className=" p-2 text-center  cursor-pointer"
                onClick={() => setEditStatus(true)}
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

export default ImageMessageInbound;
