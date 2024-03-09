/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "antd";
import CryptoJS from "crypto-js";
import { AiOutlineComment } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { LuSendHorizonal, LuShare2 } from "react-icons/lu";
import { FiMoreVertical } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import isEqual from "lodash/isEqual";
import {
  deletePost,
  fetchPosts,
  fetchRegister,
  updatePost,
  updateRegister,
} from "../Redux/action";
import { Button, Dropdown } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from "jalali-moment";
import { BiCloset, BiWindowClose } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
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
  const Registers = useSelector((state) => state.Registers);
  const [ShowComment, setShowComment] = useState(false);
  const [commentText, setcommentText] = useState("");
  const [Post, setPost] = useState({});

  useEffect(() => {
    dispatch(fetchRegister());
    dispatch(fetchPosts());
  }, []);

  useEffect(() => {
    Posts.map((data) => {
      if (data.id == SelectePost) {
        setPost(data);
      }
    });
  });

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

  const LikePost = async () => {
    dispatch(
      updatePost(Post.id, {
        ...Post,
        likes: [
          ...Post.likes,
          {
            username: decryptAES(sessionStorage.getItem("u")),
            profileImg: ProfileImg,
          },
        ],
      })
    );

    dispatch(fetchRegister());
    dispatch(fetchPosts());
  };

  const items = [
    {
      key: "1",
      label: (
        <span
          className="flex items-center text-lg text-red-500"
          onClick={async () => {
            dispatch(deletePost(Post.id));
            setShowPostModel(false);
            Registers.map(async (data) => {
              if (data.username == decryptAES(sessionStorage.getItem("u"))) {
                dispatch(
                  updateRegister(data.id, {
                    ...data,
                    post: data.post - 1,
                  })
                );
              }
            });
            dispatch(fetchRegister());
          }}
        >
          <RiDeleteBin6Line size={24} /> Delete Post
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span
          className="flex items-center text-lg text-red-500"
          onClick={async () => {
            setShowComment(false);
            setShowPostModel(false);
          }}
        >
          <IoClose size={24} /> Close
        </span>
      ),
    },
  ];
  const now = Date.now();
  const SendComment = async () => {
    dispatch(
      updatePost(Post.id, {
        ...Post,
        comment: [
          ...Post.comment,
          {
            text: commentText,
            owner: decryptAES(sessionStorage.getItem("u")),
            profileImg: ProfileImg,
            time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
          },
        ],
      })
    );
    dispatch(fetchPosts());
    setcommentText("");
  };
  const commentsContainer = useRef();
  console.log(commentsContainer);

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
            {!ShowComment && (
              <div
                className={`h-5 flex items-center justify-between px-4 py-8 `}
              >
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
            )}
            {Post.type && Post.type.startsWith("video") ? (
              <video
                src={Post.postMedia}
                className={`2xl:w-[100%] ${ShowComment && "hidden"}`}
                controls
              />
            ) : (
              <img
                src={Post.postMedia}
                className={`2xl:w-[100%] ${ShowComment && "hidden"}`}
                style={{
                  backgroundSize: "cover",
                }}
                alt=""
              />
            )}

            <div
              className={`flex items-center justify-between ${
                dimensions.width > 900 ? "px-4" : "px-2"
              }`}
            >
              {!isEqual(Post.likes, []) ? (
                <div class="flex -space-x-4 rtl:space-x-reverse items-center justify-between">
                  {(() => {
                    let counter = 0;
                    if (counter < 4) {
                      if (Post.likes) {
                        return Post.likes.map((data) => {
                          counter++;
                          return (
                            <img
                              class={`${LikedProfile} border-2 border-white rounded-full dark:border-gray-800`}
                              src={data.profileImg}
                              alt=""
                            />
                          );
                        });
                      }
                    }
                  })()}
                  &nbsp; &nbsp; &nbsp;
                  {Post.likes && (
                    <span>Liked by {Post.likes[0].username} and other</span>
                  )}
                </div>
              ) : (
                <h1>No One Liked It</h1>
              )}
              <div className="flex justify-around px-2 pt-4 gap-2">
                <span className="flex flex-col items-center">
                  {(() => {
                    if (!isEqual(Post, {})) {
                      if (!isEqual(Post.likes, [])) {
                        for (let i = 0; i < Post.likes.length; i++) {
                          const data = Post.likes[i];
                          if (
                            data.username ==
                            decryptAES(sessionStorage.getItem("u"))
                          ) {
                            return (
                              <FaHeart
                                color="red"
                                size={iconSize}
                                style={{ cursor: "pointer" }}
                              />
                            );
                          } else {
                            return (
                              <FaRegHeart
                                size={iconSize}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  LikePost(Post.id);
                                }}
                              />
                            );
                          }
                        }
                      } else {
                        return (
                          <FaRegHeart
                            size={iconSize}
                            style={{ cursor: "pointer" }}
                            onClick={async () => {
                              LikePost(Post.id);
                            }}
                          />
                        );
                      }
                    }
                  })()}
                  <span>{Post.likes && Post.likes.length}</span>
                </span>

                <span
                  className="flex flex-col items-center"
                  onClick={() => setShowComment(!ShowComment)}
                >
                  <AiOutlineComment
                    size={iconSize}
                    style={{ cursor: "pointer" }}
                  />
                  {Post.comment && Post.comment.length}
                </span>
                <LuShare2 size={iconSize} style={{ cursor: "pointer" }} />
                {decryptAES(sessionStorage.getItem("u")) == Post.owner && (
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
              <span className=" text-xl">
                {decryptAES(sessionStorage.getItem("u"))}
              </span>
              <div
                dangerouslySetInnerHTML={{ __html: Post.disc }}
                style={{ color: "white", fontSize: "20px" }}
              />
            </div>
            <div className="px-4">
              {(() => {
                if (!isEqual(Post.comment, [])) {
                  if (ShowComment) {
                    return (
                      <span
                        onClick={() => setShowComment(false)}
                        className="cursor-pointer"
                      >
                        {" "}
                        Close Comments
                      </span>
                    );
                  } else {
                    return (
                      <span
                        onClick={() => setShowComment(true)}
                        className="cursor-pointer"
                      >
                        View All {Post.comment && Post.comment.length} Comments
                      </span>
                    );
                  }
                } else {
                  return (
                    <span onClick={() => setShowComment(!ShowComment)}>
                      There are no comments
                    </span>
                  );
                }
              })()}
            </div>
            {/* <br /> */}
            {ShowComment && (
              <div className="h-[70%] w-full  p-4 ">
                <div
                  ref={commentsContainer}
                  className={`overflow-y-auto  ${
                    isEqual(Post.comment, []) ? "h-[1rem]" : "h-[10rem]"
                  }`}
                >
                  {Post.comment.map((data) => {
                    return (
                      <span class="flex  py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div class="flex-shrink-0">
                          <img
                            class="rounded-full w-11 h-11"
                            src={data.profileImg}
                            alt=""
                          />
                        </div>
                        <div class="w-full ps-3">
                          <div class="text-gray-500 text-xl mb-1.5 dark:text-gray-400">
                            {data.text}
                          </div>
                          <div class="text-xs text-blue-600 dark:text-blue-500">
                            {data.time}
                          </div>
                        </div>
                      </span>
                    );
                  })}
                </div>
                <div className="h-[10%] flex items-center">
                  <input
                    value={commentText}
                    onChange={(e) => {
                      setcommentText(e.target.value);
                    }}
                    type="text"
                    placeholder="Leave a comment..."
                    className="w-full"
                    style={{
                      height: "3rem",
                      borderRadius: "4px",
                      padding: "0 10px",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  <LuSendHorizonal
                    className="absolute right-8 cursor-pointer"
                    size={25}
                    onClick={() => {
                      SendComment();
                    }}
                  />
                </div>
              </div>
            )}

            <span className="px-4 text-sm text-[#80808085]">°{Post.time}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPostModel;
