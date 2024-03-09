import React, { useEffect, useState } from "react";
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
  const [ShowComment, setShowComment] = useState(false);
  const [commentText, setcommentText] = useState("");

  // useEffect(() => {
  //   dispatch(fetchRegister());
  //   dispatch(fetchPosts());
  // }, []);
  // useEffect(() => {
  //   dispatch(fetchRegister());
  //   dispatch(fetchPosts());
  // }, [change]);
  useEffect(() => {
    dispatch(fetchPosts());
  }, [change]);

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
        await Change("change");
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
  const now = Date.now();
  const SendComment = () => {
    Posts.map(async (data) => {
      if (data.id == SelectePost.id) {
        await Change("change");
        await dispatch(
          updatePost(data.id, {
            ...data,
            comment: [
              ...data.comment,
              {
                text: commentText,
                owner: decryptAES(sessionStorage.getItem("u")),
                profileImg: ProfileImg,
                time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
              },
            ],
          })
        );
        setcommentText("");
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
            {SelectePost.type && SelectePost.type.startsWith("video") ? (
              <video
                src={SelectePost.postMedia}
                className={`2xl:w-[100%] ${ShowComment && "hidden"}`}
                controls
              />
            ) : (
              <img
                src={SelectePost.postMedia}
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
              {!isEqual(SelectePost.likes, []) ? (
                <div class="flex -space-x-4 rtl:space-x-reverse items-center justify-between">
                  {(() => {
                    let counter = 0;
                    if (counter < 4) {
                      if (SelectePost.likes) {
                        return SelectePost.likes.map((data) => {
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
                  {SelectePost.likes && (
                    <span>
                      Liked by {SelectePost.likes[0].username} and other
                    </span>
                  )}
                </div>
              ) : (
                <h1>No One Liked It</h1>
              )}
              <div className="flex justify-around px-2 pt-4 gap-2">
                <span className="flex flex-col items-center">
                  {(() => {
                    if (!isEqual(SelectePost, {})) {
                      if (!isEqual(SelectePost.likes, [])) {
                        for (let i = 0; i < SelectePost.likes.length; i++) {
                          const data = SelectePost.likes[i];
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
                                  LikePost(SelectePost.id);
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
                            onClick={() => {
                              LikePost(SelectePost.id);
                            }}
                          />
                        );
                      }
                    }
                  })()}
                  <span>{SelectePost.likes && SelectePost.likes.length}</span>
                </span>

                <span
                  className="flex flex-col items-center"
                  onClick={() => setShowComment(!ShowComment)}
                >
                  <AiOutlineComment
                    size={iconSize}
                    style={{ cursor: "pointer" }}
                  />
                  {SelectePost.comment && SelectePost.comment.length}
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
              <span className=" text-xl">
                {decryptAES(sessionStorage.getItem("u"))}
              </span>
              <div
                dangerouslySetInnerHTML={{ __html: SelectePost.disc }}
                style={{ color: "white", fontSize: "20px" }}
              />
            </div>
            <div className="px-4">
              {(() => {
                if (!isEqual(SelectePost.comment, [])) {
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
                        View All{" "}
                        {SelectePost.comment && SelectePost.comment.length}{" "}
                        Comments
                      </span>
                    );
                  }
                } else {
                  return <span>There are no comments</span>;
                }
              })()}
            </div>
            {/* <br /> */}
            {ShowComment && (
              <div className="h-[70%] w-full  p-4 ">
                <div
                  className={`overflow-y-auto  ${
                    isEqual(SelectePost.comment, []) ? "h-[1rem]" : "h-[10rem]"
                  }`}
                >
                  {SelectePost.comment.map((data) => {
                    return (
                      <a
                        href=""
                        class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"

                      >
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
                      </a>
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

            <span className="px-4 text-sm text-[#80808085]">
              °{SelectePost.time}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPostModel;
