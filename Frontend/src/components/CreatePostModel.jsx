import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { BsBodyText } from "react-icons/bs";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Image } from "antd";
import { SiApostrophe } from "react-icons/si";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AddPost, updateRegister } from "../Redux/action";
import CryptoJS from "crypto-js";

const { Dragger } = Upload;

function CreatePostModel({ show, dimensions, setShow }) {
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
          "https://localhost:7028/api/FileManager/uploadfile",
          form
        );
        setFileMedia(info.file);
        if (info.file.originFileObj.type.startsWith("video")) {
          setPostVideo(
            `https://localhost:7028/api/FileManager/downloadfile?FileName=${info.file.originFileObj.name}`
          );
        } else {
          setPostImg(
            `https://localhost:7028/api/FileManager/downloadfile?FileName=${info.file.originFileObj.name}`
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

  const CreatePost = async () => {
    setShow(false);
    setPostImg("");
    setDesc("");
    await dispatch(
      AddPost({
        postMedia: `https://localhost:7028/api/FileManager/downloadfile?FileName=${FileMedia.originFileObj.name}`,
        disc: Desc,
        owner: decryptAES(sessionStorage.getItem("u")),
        like: 0,
        type: FileMedia.originFileObj.type,
      })
    );
    Registers.map(async (data) => {
      if (data.username == decryptAES(sessionStorage.getItem("u"))) {
        await dispatch(
          updateRegister(data.id, {
            id: data.id,
            username: data.username,
            password: data.password,
            profileImg: data.profileImg,
            email: data.email,
            hash: data.hash,
            connection: data.connection,
            post: data.post + 1,
            bio: data.bio,
            gender: data.gender,
            fullName: data.fullName,
          })
        );
      }
    });
  };

  return (
    <div
      className={`relative z-10 ${!show && "hidden"} `}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
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
                            <Image width={300} src={PostImg} />
                          </div>
                        );
                      }
                      if (PostVideo) {
                        return (
                          <div className="w-full flex justify-center mt-4">
                            <video controls width={400} src={PostVideo} />
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
                </div>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModel;
