import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Input, Tag, theme, Tooltip } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { BsBodyText } from "react-icons/bs";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { SiApostrophe } from "react-icons/si";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  AddPost,
  fetchPosts,
  fetchRegister,
  updateRegister,
} from "../../Redux/action";
import CryptoJS from "crypto-js";
import moment from "jalali-moment";
import { AiTwotoneTags } from "react-icons/ai";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  DeleteOutlined,
  ZoomOutOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Image, Space } from "antd";

const { Dragger } = Upload;

function CreatePostModel({ show, dimensions, setShow, ProfileImg }) {
  const [Desc, setDesc] = useState("");
  const [PostImg, setPostImg] = useState("");
  const [PostVideo, setPostVideo] = useState("");
  const [FileMedia, setFileMedia] = useState({});
  const Registers = useSelector((state) => state.Registers);
  const dispatch = useDispatch();
  const key = CryptoJS.enc.Utf8.parse("1234567890123456");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");

  function decryptAES(message) {
    const bytes = CryptoJS.AES.decrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  const props = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        var form = new FormData();
        form.append("file", info.file.originFileObj);
        await axios.post(
          "http://localhost:5221/api/FileManager/uploadfile",
          form
        );
        setFileMedia(info.file);
        if (info.file.originFileObj.type.startsWith("video")) {
          setPostVideo(
            `http://localhost:5221/api/FileManager/downloadfile?FileName=${info.file.originFileObj.name}`
          );
        } else {
          setPostImg(
            `http://localhost:5221/api/FileManager/downloadfile?FileName=${info.file.originFileObj.name}`
          );
        }
      }
      if (status === "done") {
        // message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const now = Date.now();
  const CreatePost = async () => {
    setShow(false);
    setPostImg("");
    setPostVideo("");
    setDesc("");
    await dispatch(
      AddPost({
        postMedia: `http://localhost:5221/api/FileManager/downloadfile?FileName=${FileMedia.originFileObj.name}`,
        disc: Desc,
        owner: decryptAES(sessionStorage.getItem("u")),
        likes: [],
        type: FileMedia.originFileObj.type,
        time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
        comment: [],
        profileImg: ProfileImg,
      })
    );
    Registers.map(async (data) => {
      if (data.username == decryptAES(sessionStorage.getItem("u"))) {
        await dispatch(
          updateRegister(data.id, {
            ...data,
            post: data.post + 1,
          })
        );
        await dispatch(fetchRegister());
      }
    });
  };

  const onDownload = (src) => {
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  const tagInputStyle = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: "top",
  };

  const { token } = theme.useToken();
  const [tags, setTags] = useState([
    FileMedia.originFileObj && FileMedia.originFileObj.type.startsWith("video")
      ? "photo"
      : "video",
  ]);
  console.log(FileMedia.originFileObj.type.startsWith("video")) 
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };
  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };
  const tagPlusStyle = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };
  console.log(tags);
  return (
    <div
      className={`relative z-10 ${!show && "hidden"} `}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="CreatePostModel"
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`relative transform overflow-hidden rounded-lg bg-gray-700  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[40rem] ${
              dimensions.width < 640 && "mb-40"
            }`}
          >
            <div className="bg-gray-700  px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
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
                      className="text-xl font-semibold leading-6 text-[white] mt-1"
                      id="modal-title"
                    >
                      Create Post
                    </h1>

                    <lord-icon
                      src="https://cdn.lordicon.com/snqonmhs.json"
                      trigger="in"
                      colors="primary:#ffffff,secondary:#e83a30"
                      style={{ transform: "scale(1.3)", cursor: "pointer" }}
                      onClick={() => {
                        setShow(false);
                        setDesc("");
                        setPostImg("");
                      }}
                    ></lord-icon>
                  </div>

                  <div className="col-span-2 mt-8">
                    <label
                      htmlFor="description"
                      className="items-center gap-2  mb-2 text-[18px]  font-medium  flex"
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
                        className="test"
                        editor={ClassicEditor}
                        data={Desc}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setDesc(data);
                        }}
                      />
                    </div>
                  </div>
                  <br />
                  <span className="flex items-center gap-2 text-[18px] font-medium">
                    <SiApostrophe size={24} /> Post Media
                  </span>

                  {(() => {
                    if (PostImg || PostVideo) {
                      if (PostImg) {
                        return (
                          <div className="w-full text-center mt-4">
                            <Image
                              width={200}
                              src={PostImg}
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
                                    size={12}
                                    className="toolbar-wrapper rounded-[1.7rem] p-4"
                                    style={{
                                      backgroundColor: "rgba(55, 65, 81, 0.3)",
                                    }}
                                  >
                                    <DeleteOutlined
                                      onClick={() => {
                                        setPostImg("");
                                        setPostVideo("");
                                      }}
                                      style={{ fontSize: "25px" }}
                                    />
                                    <DownloadOutlined
                                      style={{ fontSize: "25px" }}
                                      onClick={() =>
                                        onDownload(PostImg || PostVideo)
                                      }
                                    />
                                    <SwapOutlined
                                      style={{ fontSize: "25px" }}
                                      rotate={90}
                                      onClick={onFlipY}
                                    />
                                    <SwapOutlined
                                      onClick={onFlipX}
                                      style={{ fontSize: "25px" }}
                                    />
                                    <RotateLeftOutlined
                                      style={{ fontSize: "25px" }}
                                      onClick={onRotateLeft}
                                    />
                                    <RotateRightOutlined
                                      style={{ fontSize: "25px" }}
                                      onClick={onRotateRight}
                                    />
                                    <ZoomOutOutlined
                                      style={{ fontSize: "25px" }}
                                      disabled={scale === 1}
                                      onClick={onZoomOut}
                                    />
                                    <ZoomInOutlined
                                      style={{ fontSize: "25px" }}
                                      disabled={scale === 50}
                                      onClick={onZoomIn}
                                    />
                                  </Space>
                                ),
                              }}
                            />
                          </div>
                        );
                      }
                      if (PostVideo) {
                        return (
                          <div className="w-full flex justify-center mt-4">
                            <span className="flex items-start justify-end">
                              <video controls width={400} src={PostVideo} />
                              <CloseCircleOutlined
                                onClick={() => {
                                  setPostImg("");
                                  setPostVideo("");
                                }}
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
                            className="ant-upload-text "
                            style={{ color: "white" }}
                          >
                            Click or drag file to this area to upload
                          </p>
                        </Dragger>
                      );
                    }
                  })()}
                  <div className="mt-4">
                    <h1 className="flex items-center text-[18px] font-medium gap-1 ">
                      <AiTwotoneTags size={24} />
                      Tag
                    </h1>
                    <Flex gap="4px 0" className="mt-2" wrap="wrap">
                      {tags.map((tag, index) => {
                        if (editInputIndex === index) {
                          return (
                            <Input
                              ref={editInputRef}
                              key={tag}
                              size="small"
                              style={tagInputStyle}
                              value={editInputValue}
                              onChange={handleEditInputChange}
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
                            style={{
                              userSelect: "none",
                            }}
                            onClose={() => handleClose(tag)}
                          >
                            <span
                              onDoubleClick={(e) => {
                                if (index !== 0) {
                                  setEditInputIndex(index);
                                  setEditInputValue(tag);
                                  e.preventDefault();
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
                          style={tagInputStyle}
                          value={inputValue}
                          onChange={handleInputChange}
                          onBlur={handleInputConfirm}
                          onPressEnter={handleInputConfirm}
                        />
                      ) : (
                        <Tag
                          style={tagPlusStyle}
                          icon={<PlusOutlined />}
                          onClick={showInput}
                        >
                          New Tag
                        </Tag>
                      )}
                    </Flex>
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              if (PostImg || PostVideo) {
                return (
                  <div className="bg-gray-700  px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      onClick={() => CreatePost()}
                      type="button"
                      className="inline-flex w-full justify-center rounded-md mb-3  px-12  text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/dangivhk.json"
                        trigger="hover"
                        colors="primary:#ffffff,secondary:#08a88a"
                        style={{ transform: "scale(1.5)", cursor: "pointer" }}
                      ></lord-icon>
                    </button>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModel;
