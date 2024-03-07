import React from "react";
import { Avatar } from "antd";
import CryptoJS from "crypto-js";
import { AiOutlineComment } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { LuShare2 } from "react-icons/lu";
import { FiMoreVertical } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../Redux/action";
const ShowPostModel = ({
  ProfileImg,
  showPostModel,
  setShowPostModel,
  SelectePost,
  dimensions,
  Posts,
}) => {
  const key = CryptoJS.enc.Utf8.parse("1234567890123456");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
  const dispatch = useDispatch();

  function decryptAES(message) {
    const bytes = CryptoJS.AES.decrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  let iconSize = dimensions.width > 900 ? 30 : 25;

  const LikePost = async (id) => {
    Posts.map(async (data) => {
      if (data.id == id) {
        await dispatch(
          updatePost(id, {
            id: id,
            postMedia: data.postMedia,
            disc: data.disc,
            owner: data.owner,
            like: data.like + 1,
            type: data.type,
          })
        );
      }
    });
  };

  return (
    <div
      className={`relative z-10 ${!showPostModel && "hidden"}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`relative transform overflow-hidden rounded-lg bg-gray-700  text-left shadow-xl transition-all sm:my-8 w-[90%]  md:w-[70%] h[80%]`}
            style={{ marginBottom: dimensions.width < 642 && "200px" }}
          >
            <div className="h-10 flex items-center justify-between px-4 py-8">
              <div className="flex items-center gap-2">
                <Avatar src={ProfileImg} size="large" />
                <span className="text-2xl">
                  {decryptAES(sessionStorage.getItem("u"))}
                </span>
              </div>
              <lord-icon
                src="https://cdn.lordicon.com/snqonmhs.json"
                trigger="in"
                colors="primary:#ffffff,secondary:#e83a30"
                style={{ transform: "scale(1.3)", cursor: "pointer" }}
                onClick={() => {
                  setShowPostModel(false);
                }}
              ></lord-icon>
            </div>
            {SelectePost.type && SelectePost.type.startsWith("video") ? (
              <video
                src={SelectePost.postMedia}
                className="2xl:w-[100%]"
                controls
              />
            ) : (
              <img
                src={SelectePost.postMedia}
                className="2xl:w-[100%]"
                style={{
                  backgroundSize: "cover",
                }}
                alt=""
              />
            )}
            <div className="flex justify-around p-2">
              <FaRegHeart
                size={iconSize}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  LikePost(SelectePost.id);
                }}
              />
              <AiOutlineComment size={iconSize} style={{ cursor: "pointer" }} />
              <LuShare2 size={iconSize} style={{ cursor: "pointer" }} />
              <FiMoreVertical size={iconSize} style={{ cursor: "pointer" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPostModel;
