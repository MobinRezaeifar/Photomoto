import React, { useEffect, useRef, useState } from "react";
import {
  PlusOutlined,
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  DeleteOutlined,
  ZoomOutOutlined,
  CloseCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Flex, Input, Tag, theme, Tooltip, Upload, Image, Space } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { BsBodyText } from "react-icons/bs";
import { SiApostrophe } from "react-icons/si";
import { AiTwotoneTags } from "react-icons/ai";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AddPost } from "../../Redux/action";
import moment from "jalali-moment";
import isEqual from "lodash.isequal";
import { RotatingLines } from "react-loader-spinner";

const { Dragger } = Upload;

const CreatePostModel = ({
  show,
  dimensions,
  setShow,
  Change,
  mainUser,
  GetData,
}) => {
  const [desc, setDesc] = useState("");
  const [postImg, setPostImg] = useState("");
  const [postVideo, setPostVideo] = useState("");
  const [fileMedia, setFileMedia] = useState({});
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const PFMbaseApi = useSelector((state) => state.PFMbaseApi);
  const fileName = Date.now().toString();
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  const { token } = theme.useToken();

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleUploadChange = async (info) => {
    setIsLoading(true);
    const { status, originFileObj } = info.file;
    if (status === "uploading") return;

    const form = new FormData();
    form.append(
      "file",
      originFileObj,
      originFileObj.type.startsWith("video")
        ? `${fileName}.mp4`
        : `${fileName}.png`
    );
    await axios.post(`${PFMbaseApi}api/FileManager/uploadfile`, form);

    setFileMedia({
      name: originFileObj.type.startsWith("video")
        ? `${fileName}.mp4`
        : `${fileName}.png`,
      type: originFileObj.type,
    });
    if (originFileObj.type.startsWith("video")) {
      setPostVideo(
        `${PFMbaseApi}api/FileManager/downloadfile?FileName=${fileName}.mp4`
      );
    } else {
      setPostImg(
        `${PFMbaseApi}api/FileManager/downloadfile?FileName=${fileName}.png`
      );
    }

    if (status === "done") {
    } else if (status === "error") {
    }
  };

  const handleCreatePost = async () => {
    await setShow(false);
    const now = Date.now();
    await dispatch(
      AddPost({
        postMedia: fileMedia.name,
        disc: desc,
        owner: mainUser,
        likes: [],
        type: fileMedia.type,
        time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
        comment: [],
        tags,
      })
    );
    await Change("change");
    setPostImg("");
    setPostVideo("");
    setDesc("");
    setTags([]);
    setFileMedia({});
    await GetData();
  };

  const handleTagClose = (removedTag) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const onDownload = (src) => {
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "media";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  const props = {
    name: "file",
    accept: "image/*,video/*",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange: handleUploadChange,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  useEffect(() => {
    if (postImg || postVideo) {
      return setIsLoading(false);
    }
  }, [postImg || postVideo]);

  return (
    <div
      className={`relative z-10 ${!show && "hidden"}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`relative transform overflow-hidden rounded-lg bg-gray-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[40rem] ${
              dimensions.width < 640 && "mb-40"
            }`}
          >
            <div className="bg-gray-700 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <lord-icon
                  src="https://cdn.lordicon.com/pbhjpofq.json"
                  trigger="hover"
                  style={{ transform: "scale(1.3)" }}
                  className="testt"
                ></lord-icon>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <div className="w-full flex justify-between">
                    <h1
                      className="text-xl font-semibold leading-6 text-white mt-1"
                      id="modal-title"
                    >
                      Create Post
                    </h1>
                    <lord-icon
                      src="https://cdn.lordicon.com/snqonmhs.json"
                      trigger="in"
                      colors="primary:#ffffff,secondary:#e83a30"
                      style={{ transform: "scale(1.3)", cursor: "pointer" }}
                      onClick={() => setShow(false)}
                    ></lord-icon>
                  </div>

                  <br />
                  <span className="flex items-center gap-2 text-[18px] font-medium">
                    <SiApostrophe size={24} /> Post Media
                  </span>
                  {(() => {
                    if (postImg || postVideo) {
                      if (postImg) {
                        return (
                          <div className="w-full text-center mt-4">
                            <Image
                              width={200}
                              src={postImg}
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
                                  <Space
                                    size={2}
                                    className="toolbar-wrapper rounded-[1.7rem] p-4"
                                    style={{
                                      backgroundColor: "rgba(55, 65, 81, 0.3)",
                                    }}
                                  >
                                    <DeleteOutlined
                                      onClick={() => {
                                        setPostImg("");
                                        setFileMedia({});
                                        setTags([]);
                                      }}
                                      style={{
                                        fontSize:
                                          dimensions.width > 900
                                            ? "25px"
                                            : "15px",
                                      }}
                                    />
                                    <DownloadOutlined
                                      onClick={() => onDownload(postImg)}
                                      style={{
                                        fontSize:
                                          dimensions.width > 900
                                            ? "25px"
                                            : "15px",
                                      }}
                                    />
                                    <SwapOutlined
                                      onClick={onFlipY}
                                      style={{
                                        fontSize:
                                          dimensions.width > 900
                                            ? "25px"
                                            : "15px",
                                      }}
                                      rotate={90}
                                    />
                                    <SwapOutlined
                                      onClick={onFlipX}
                                      style={{
                                        fontSize:
                                          dimensions.width > 900
                                            ? "25px"
                                            : "15px",
                                      }}
                                    />
                                    <RotateLeftOutlined
                                      onClick={onRotateLeft}
                                      style={{
                                        fontSize:
                                          dimensions.width > 900
                                            ? "25px"
                                            : "15px",
                                      }}
                                    />
                                    <RotateRightOutlined
                                      onClick={onRotateRight}
                                      style={{
                                        fontSize:
                                          dimensions.width > 900
                                            ? "25px"
                                            : "15px",
                                      }}
                                    />
                                    <ZoomOutOutlined
                                      onClick={onZoomOut}
                                      style={{
                                        fontSize:
                                          dimensions.width > 900
                                            ? "25px"
                                            : "15px",
                                      }}
                                      disabled={scale === 1}
                                    />
                                    <ZoomInOutlined
                                      onClick={onZoomIn}
                                      style={{
                                        fontSize:
                                          dimensions.width > 900
                                            ? "25px"
                                            : "15px",
                                      }}
                                      disabled={scale === 50}
                                    />
                                  </Space>
                                ),
                              }}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div className="w-full flex justify-center mt-4">
                            <span className="flex items-start justify-end">
                              <video controls width={400} src={postVideo} />
                              <CloseCircleOutlined
                                onClick={() => setPostVideo("")}
                                style={{
                                  fontSize: "25px",
                                  position: "absolute",
                                  color: "rgba(255, 0, 0, 0.7)",
                                }}
                              />
                            </span>
                          </div>
                        );
                      }
                    } else {
                      return (
                        <Dragger
                          {...props}
                          style={{
                            display: isEqual(IsLoading, true) && "none",
                            marginTop: "10px",
                            width:
                              dimensions.width < 564
                                ? dimensions.width - 90
                                : "500px",
                          }}
                        >
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p
                            className="ant-upload-text"
                            style={{ color: "white" }}
                          >
                            Click or drag file to this area to upload
                          </p>
                        </Dragger>
                      );
                    }
                  })()}

                  {IsLoading && (
                    <div className="w-full flex justify-center">
                      <div
                        style={{ width: "100%" }}
                        role="status"
                        class="flex my-4 items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-800"
                      >
                        <svg
                          class="w-10 h-10 text-gray-200 dark:text-gray-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 16 20"
                        >
                          <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                          <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}

                  <div className="col-span-2 mt-8">
                    <label
                      htmlFor="description"
                      className="items-center gap-2 mb-2 text-[18px] font-medium flex"
                    >
                      <BsBodyText size={24} /> Description
                    </label>
                    <div
                      style={{
                        width:
                          dimensions.width < 564
                            ? dimensions.width - 90
                            : "500px",
                      }}
                    >
                      <CKEditor
                        editor={ClassicEditor}
                        data={desc}
                        onChange={(event, editor) => setDesc(editor.getData())}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    {!isEqual(fileMedia, {}) && (
                      <h1 className="flex items-center text-[18px] font-medium gap-1">
                        <AiTwotoneTags size={24} />
                        Tag
                      </h1>
                    )}

                    <Flex gap="4px 0" className="mt-2" wrap="wrap">
                      {tags.map((tag, index) => {
                        if (editInputIndex === index) {
                          return (
                            <Input
                              ref={editInputRef}
                              key={tag}
                              size="small"
                              style={{
                                width: 64,
                                height: 22,
                                marginInlineEnd: 8,
                                verticalAlign: "top",
                              }}
                              value={editInputValue}
                              onChange={(e) =>
                                setEditInputValue(e.target.value)
                              }
                              onBlur={handleEditInputConfirm}
                              onPressEnter={handleEditInputConfirm}
                            />
                          );
                        }
                        const isLongTag = tag.length > 20;
                        const tagElem = (
                          <Tag
                            key={tag}
                            closable={index !== 0}
                            style={{ userSelect: "none" }}
                            onClose={() => handleTagClose(tag)}
                          >
                            <span
                              onDoubleClick={() => {
                                if (index !== 0) {
                                  setEditInputIndex(index);
                                  setEditInputValue(tag);
                                }
                              }}
                            >
                              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </span>
                          </Tag>
                        );
                        return isLongTag ? (
                          <Tooltip title={tag} key={tag}>
                            {tagElem}
                          </Tooltip>
                        ) : (
                          tagElem
                        );
                      })}
                      {inputVisible ? (
                        <Input
                          ref={inputRef}
                          type="text"
                          size="small"
                          style={{
                            width: 64,
                            height: 22,
                            marginInlineEnd: 8,
                            verticalAlign: "top",
                          }}
                          value={inputValue}
                          onChange={(e) =>
                            setInputValue(e.target.value.toLowerCase())
                          }
                          onBlur={handleInputConfirm}
                          onPressEnter={handleInputConfirm}
                        />
                      ) : (
                        !isEqual(fileMedia, {}) && (
                          <Tag
                            style={{
                              height: 22,
                              background: token.colorBgContainer,
                              borderStyle: "dashed",
                            }}
                            icon={<PlusOutlined />}
                            onClick={() => setInputVisible(true)}
                          >
                            New Tag
                          </Tag>
                        )
                      )}
                    </Flex>
                  </div>
                </div>
              </div>
            </div>

            {postImg || postVideo ? (
              <div className="bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={handleCreatePost}
                  type="button"
                  className="inline-flex w-full justify-center rounded-md mb-3 px-12 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/dangivhk.json"
                    trigger="hover"
                    colors="primary:#ffffff,secondary:#08a88a"
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  ></lord-icon>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModel;
