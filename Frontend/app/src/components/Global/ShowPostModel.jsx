/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
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
} from "../../Redux/action";
import { Button, Dropdown } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from "jalali-moment";
import { BiCloset, BiWindowClose } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
const ShowPostModel = ({ SelectePost, dimensions, Posts }) => {
  const key = CryptoJS.enc.Utf8.parse("1234567890123456");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");
  const dispatch = useDispatch();
  const Registers = useSelector((state) => state.Registers);
  const [ShowComment, setShowComment] = useState(false);
  const [commentText, setcommentText] = useState("");
  const [Post, setPost] = useState({});
  const showPostModel = useSelector((state) => state.ShowPostModel);
  const [ProfileImg, setProfileImg] = useState("");
  let navigate = useNavigate();

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
    await dispatch(
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

    await dispatch(fetchRegister());
    await dispatch(fetchPosts());
  };

  const items = [];
  if (decryptAES(sessionStorage.getItem("u")) == Post.owner) {
    items.push(
      {
        key: "1",
        label: (
          <span
            className="flex items-center text-lg text-red-500"
            onClick={async () => {
              await dispatch(deletePost(Post.id));
              dispatch({
                type: "SHOWPOSTMODEL",
                payload: false,
              });
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
              await dispatch(fetchRegister());
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
              dispatch({
                type: "SHOWPOSTMODEL",
                payload: false,
              });
            }}
          >
            <IoClose size={24} /> Close
          </span>
        ),
      }
    );
  } else {
    items.push({
      key: "2",
      label: (
        <span
          className="flex items-center text-lg text-red-500"
          onClick={async () => {
            setShowComment(false);
            dispatch({
              type: "SHOWPOSTMODEL",
              payload: false,
            });
          }}
        >
          <IoClose size={24} /> Close
        </span>
      ),
    });
  }

  const now = Date.now();
  const SendComment = async () => {
    await dispatch(
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
    await dispatch(fetchPosts());
    setcommentText("");
  };

  useEffect(() => {
    Registers.map(async (data) => {
      if (data.username == decryptAES(sessionStorage.getItem("u"))) {
        if (data.profileImg) {
          setProfileImg(data.profileImg);
        } else {
          setProfileImg("https://wallpapercave.com/dwp1x/wp9566386.jpg");
        }
      }
    });
  });

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
                  <Avatar src={Post.profileImg} size="large" />
                  <span
                    onClick={() => {
                      console.log(window.location.href);
                      if (
                        window.location.href !==
                        `http://localhost:3000/photomoto/${Post.owner}`
                      ) {
                        navigate(`${Post.owner}`);
                        dispatch({
                          type: "SHOWPOSTMODEL",
                          payload: false,
                        });
                      }
                    }}
                    className="text-2xl cursor-pointer"
                  >
                    {Post.owner}
                  </span>
                </div>

                <div className="flex items-center">
                  <lord-icon
                    src="https://cdn.lordicon.com/snqonmhs.json"
                    trigger="in"
                    colors="primary:#ffffff,secondary:#e83a30"
                    style={{ transform: "scale(1.3)", cursor: "pointer" }}
                    onClick={() => {
                      dispatch({
                        type: "SHOWPOSTMODEL",
                        payload: false,
                      });
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
                <div className="flex items-center gap-1">
                  <Avatar.Group
                    maxCount={4}
                    className="flex items-center"
                    size="large"
                    maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  >
                    {(() => {
                      let counter = 0;
                      if (counter < 4) {
                        if (Post.likes) {
                          return Post.likes.map((data) => {
                            counter++;
                            return Registers.map((dataa) => {
                              if (data.username == dataa.username) {
                                return <Avatar src={dataa.profileImg} />;
                              }
                            });
                          });
                        }
                      }
                    })()}
                  </Avatar.Group>
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
                        let likeStatus = Post.likes.some(
                          (x) =>
                            x.username ==
                            decryptAES(sessionStorage.getItem("u"))
                        );
                        if (likeStatus) {
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

                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items,
                  }}
                  placement="bottomRight"
                  arrow
                >
                  <FiMoreVertical className="cursor-pointer" size={iconSize} />
                </Dropdown>
              </div>
            </div>

            <div className="flex px-4  gap-2 mb-2">
              <span className=" text-xl">{Post.owner}</span>
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
                  className={`overflow-y-auto  ${
                    isEqual(Post.comment, []) ? "h-[1rem]" : "h-[10rem]"
                  }`}
                >
                  {Post.comment.map((data) => {
                    return (
                      <span class="flex  py-3 hover:bg-gray-100 dark:hover:bg-gray-700 items-center">
                        <div class="flex-shrink-0">
                          <Avatar size={45} src={data.profileImg} />
                        </div>
                        <div class="w-full ps-3">
                          <div class="text-gray-500 text-xl mb-1.5 dark:text-gray-400">
                            {data.owner}{" "}
                            <span className="text-white">{data.text}</span>
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
