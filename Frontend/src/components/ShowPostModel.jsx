import React, { useEffect } from "react";
import { Avatar } from "antd";
import CryptoJS from "crypto-js";
import { AiOutlineComment } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { LuShare2 } from "react-icons/lu";
import { FiMoreVertical } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  fetchPosts,
  fetchRegister,
  updatePost,
  updateRegister,
} from "../Redux/action";
import { Button, Dropdown } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
const ShowPostModel = ({
  ProfileImg,
  showPostModel,
  setShowPostModel,
  SelectePost,
  dimensions,
  Posts,
  Change,
  change,
}) => {
  const key = CryptoJS.enc.Utf8.parse("1234567890123456");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
  const dispatch = useDispatch();
  const Registers = useSelector((state) => state.Registers);

  useEffect(() => {
    dispatch(fetchRegister());
    dispatch(fetchPosts());
  }, []);
  useEffect(() => {
    dispatch(fetchRegister());
    dispatch(fetchPosts());
  }, [dispatch]);

  function decryptAES(message) {
    const bytes = CryptoJS.AES.decrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  let iconSize = dimensions.width > 900 ? 30 : 25;
  let LikedProfile = dimensions.width > 900 ? "w-10 h-10" : "w-7 h-7";

  const LikePost = async (id) => {
    Posts.map(async (data) => {
      if (data.id == id) {
        await dispatch(
          updatePost(id, {
            ...data,
            likes: [
              ...data.likes,
              {
                username: decryptAES(sessionStorage.getItem("u")),
                profileImg: ProfileImg,
              },
            ],
          })
        );
      }
    });
  };
  const items = [
    {
      key: "1",
      label: (
        <span
          className="flex items-center text-lg text-red-500"
          onClick={async () => {
            await dispatch(deletePost(SelectePost.id));
            setShowPostModel(false);
            Registers.map(async (data) => {
              if (data.username == decryptAES(sessionStorage.getItem("u"))) {
                await dispatch(
                  updateRegister(data.id, {
                    ...data,
                    post: data.post - 1,
                  })
                );
              }
            });
          }}
        >
          <RiDeleteBin6Line size={24} /> Delete Post
        </span>
      ),
    },
  ];
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
            className={`relative transform overflow-hidden rounded-lg bg-gray-700  text-left shadow-xl transition-all sm:my-8 w-[100%]  md:w-[50%] xl:w-[50%] h[60%]`}
            style={{ marginBottom: dimensions.width < 642 && "200px" }}
          >
            <div className="h-5 flex items-center justify-between px-4 py-8">
              <div className="flex items-center gap-2">
                <Avatar src={ProfileImg} size="large" />
                <span className="text-2xl">
                  {decryptAES(sessionStorage.getItem("u"))}
                </span>
              </div>

              <div className="flex items-center">
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
            {}
            <div
              className={`flex items-center justify-between ${
                dimensions.width > 900 ? "px-4" : "px-2"
              }`}
            >
              <div class="flex -space-x-4 rtl:space-x-reverse items-center justify-between">
                <img
                  class={`${LikedProfile} border-2 border-white rounded-full dark:border-gray-800`}
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt=""
                />
                <img
                  class={`${LikedProfile} border-2 border-white rounded-full dark:border-gray-800`}
                  src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                  alt=""
                />
                <img
                  class={`${LikedProfile} border-2 border-white rounded-full dark:border-gray-800`}
                  src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                  alt=""
                />
                <img
                  class={`${LikedProfile} border-2 border-white rounded-full dark:border-gray-800`}
                  src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                  alt=""
                />
                &nbsp; Liked by mobin and other
              </div>
              <div className="flex justify-around px-2 pt-4 gap-2">
                <span className="flex flex-col items-center">
                  <FaRegHeart
                    size={iconSize}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      LikePost(SelectePost.id);
                    }}
                  />
                  {SelectePost.like}
                </span>

                <span className="flex flex-col items-center">
                  <AiOutlineComment
                    size={iconSize}
                    style={{ cursor: "pointer" }}
                  />
                  4
                </span>
                <LuShare2 size={iconSize} style={{ cursor: "pointer" }} />
                {decryptAES(sessionStorage.getItem("u")) ==
                  SelectePost.owner && (
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items,
                    }}
                    placement="bottomRight"
                    arrow
                  >
                    <FiMoreVertical
                      className="cursor-pointer"
                      size={iconSize}
                    />
                  </Dropdown>
                )}
              </div>
            </div>

            <div className="flex px-4  gap-2 mb-2">
              <span className="text-white text-xl">
                {decryptAES(sessionStorage.getItem("u"))}
              </span>
              <div
                dangerouslySetInnerHTML={{ __html: SelectePost.disc }}
                style={{ color: "", fontSize: "20px" }}
              />
            </div>
            <span className="px-4 text-[#80808085]">°{SelectePost.time}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPostModel;
