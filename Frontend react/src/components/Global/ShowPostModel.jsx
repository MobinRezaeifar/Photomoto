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
import { MdAvTimer } from "react-icons/md";
import { RiUserFollowFill } from "react-icons/ri";
import { RiUserUnfollowFill } from "react-icons/ri";

import {
  AddConnection,
  deleteConnection,
  deletePost,
  fetchConnection,
  fetchPosts,
  fetchRegister,
  UpdateConnection,
  updatePost,
} from "../../Redux/action";
import { Dropdown } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from "jalali-moment";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Cookies from "js-cookie";
import axios from "axios";

const ShowPostModel = ({
  User,
  SelectePost,
  dimensions,
  Change,
  change,
  showPostModel,
  setshowPostModel,
  headers,
}) => {
  const dispatch = useDispatch();
  const [ShowComment, setShowComment] = useState(false);
  const [commentText, setcommentText] = useState("");
  const baseUrlReact = useSelector((state) => state.baseUrlReact);
  const PUMbaseApi = useSelector((state) => state.PUMbaseApi);
  const PFMbaseApi = useSelector((state) => state.PFMbaseApi);
  const PPMbaseApi = useSelector((state) => state.PPMbaseApi);
  let navigate = useNavigate();

  let iconSize = dimensions.width > 900 ? 30 : 25;
  let LikedProfile = dimensions.width > 900 ? "w-10 h-10" : "w-7 h-7";

  const LikePost = async () => {
    await axios.patch(
      `${PPMbaseApi}Post/v1/api/UpdatePost?id=${SelectePost.id}`,
      {
        likes: [...SelectePost.likes, Cookies.get("u")],
      },
      { headers }
    );
  };

  const items = [];
  if (Cookies.get("u") == SelectePost.owner) {
    items.push({
      key: "1",
      label: (
        <div
          style={{
            backgroundColor: "#282828",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "7px 10px",
            borderRadius: "6px",
            alignItems: "center",
          }}
        >
          <span
            className="flex items-center text-lg "
            onClick={async () => {
              setShowComment(false);
              setshowPostModel(false);
            }}
          >
            <IoClose size={24} /> Close
          </span>
          <span
            className="flex items-center text-lg "
            onClick={async () => {
              await dispatch(deletePost(SelectePost.id));
              setshowPostModel(false);
            }}
          >
            <RiDeleteBin6Line size={24} /> Delete Post
          </span>
        </div>
      ),
    });
  } else {
    items.push({
      key: "2",
      label: (
        <span
          style={{
            backgroundColor: "#282828",
            display: "flex",
            padding: "7px 10px",
            borderRadius: "6px",
            alignItems: "center",
          }}
          className="flex items-center text-lg text-red-500"
          onClick={async () => {
            setShowComment(false);
            setshowPostModel(false);
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
      updatePost(SelectePost.id, {
        ...SelectePost,
        comment: [
          ...SelectePost.comment,
          {
            text: commentText,
            owner: Cookies.get("u"),
            time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
          },
        ],
      })
    );
    setcommentText("");
  };

  const handelConnection = async () => {
    // let ConnectionStatus = Connections.some(
    //   (x) =>
    //     x.relation ==
    //       decryptAES(sessionStorage.getItem("u")) + "," + Post.owner ||
    //     x.relation == Post.owner + "," + decryptAES(sessionStorage.getItem("u"))
    // );
    // if (!ConnectionStatus) {
    //   await dispatch(
    //     AddConnection({
    //       id: Date.now() + "",
    //       sender: decryptAES(sessionStorage.getItem("u")),
    //       receiver: Post.owner,
    //       time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
    //       status: "send",
    //       relation: decryptAES(sessionStorage.getItem("u")) + "," + Post.owner,
    //     })
    //   );
    //   await Change("change");
    // }
  };
  const AcceptConnection = (id) => {
    // Connections.map(async (data) => {
    //   if (data.id == id) {
    //     await dispatch(
    //       UpdateConnection(id, {
    //         ...data,
    //         status: "accept",
    //       })
    //     );
    //     await Change("change");
    //   }
    // });
  };
  const RejectConnection = (id) => {
    // Connections.map(async (data) => {
    //   if (data.id == id) {
    //     await dispatch(
    //       UpdateConnection(id, {
    //         ...data,
    //         status: "reject",
    //       })
    //     );
    //     await Change("change");
    //   }
    // });
  };
  const DisConnect = (connectionId) => {
    dispatch(deleteConnection(connectionId));
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
                <div className="flex items-center gap-1">
                  <Avatar
                    src={`${PFMbaseApi}api/FileManager/downloadfile?FileName=${User.profileImg}`}
                    size="large"
                  />
                  <span
                    onClick={() => {
                      if (
                        window.location.href !==
                        `${baseUrlReact}photomoto/${SelectePost.owner}`
                      ) {
                        navigate(`${SelectePost.owner}`);
                        setshowPostModel(false);
                      }
                    }}
                    className="text-2xl cursor-pointer"
                  >
                    {SelectePost.owner}
                  </span>
                  {/* {(() => {
                    if (Post.owner != decryptAES(sessionStorage.getItem("u"))) {
                      let ConnectionStatus = Connections.some(
                        (x) =>
                          x.relation ==
                            decryptAES(sessionStorage.getItem("u")) +
                              "," +
                              Post.owner ||
                          x.relation ==
                            Post.owner +
                              "," +
                              decryptAES(sessionStorage.getItem("u"))
                      );
                      if (ConnectionStatus) {
                        return Connections.map((data) => {
                          if (
                            data.relation ==
                              Post.owner +
                                "," +
                                decryptAES(sessionStorage.getItem("u")) ||
                            data.relation ==
                              decryptAES(sessionStorage.getItem("u")) +
                                "," +
                                Post.owner
                          ) {
                            if (data.status == "send") {
                              if (
                                data.sender ==
                                decryptAES(sessionStorage.getItem("u"))
                              ) {
                                return (
                                  <h1 className="font-bold text-lg text-gray-400 cursor-pointer flex items-center gap-1 ml-2">
                                    <MdAvTimer size={20} />
                                    Pending
                                  </h1>
                                );
                              }
                              if (
                                data.receiver ==
                                decryptAES(sessionStorage.getItem("u"))
                              ) {
                                return (
                                  <>
                                    <h1
                                      className="font-bold text-lg text-green-400 cursor-pointer flex items-center gap-1 ml-2"
                                      onClick={() => AcceptConnection(data.id)}
                                    >
                                      <RiUserFollowFill size={20} />
                                      Accept
                                    </h1>
                                    <h1
                                      className="font-bold text-lg text-red-400 cursor-pointer flex items-center gap-1 ml-2"
                                      onClick={() => RejectConnection(data.id)}
                                    >
                                      <RiUserUnfollowFill size={20} />
                                      Reject
                                    </h1>
                                  </>
                                );
                              }
                            }
                            if (data.status == "accept") {
                              return (
                                <h1
                                  onClick={() => DisConnect(data.id)}
                                  className="font-bold text-lg
                             text-red-600 cursor-pointer  ml-2"
                                  style={{ marginTop: "6px" }}
                                >
                                  -DisConnect
                                </h1>
                              );
                            }
                          }
                        });
                      } else {
                        return (
                          <h1
                            onClick={handelConnection}
                            style={{ marginTop: "6px" }}
                            className="font-bold text-lg
                             text-blue-600 cursor-pointer  ml-2"
                          >
                            + Connection
                          </h1>
                        );
                      }
                    }
                  })()} */}
                </div>
                <div className="flex items-center">
                  <lord-icon
                    src="https://cdn.lordicon.com/snqonmhs.json"
                    trigger="in"
                    colors="primary:#ffffff,secondary:#e83a30"
                    style={{ transform: "scale(1.3)", cursor: "pointer" }}
                    onClick={() => {
                      setshowPostModel(false);
                    }}
                  ></lord-icon>
                </div>
              </div>
            )}
            {SelectePost.type && SelectePost.type.startsWith("video") ? (
              <video
                src={`${PFMbaseApi}api/FileManager/downloadfile?FileName=${SelectePost.postMedia}`}
                className={`2xl:w-[100%] ${ShowComment && "hidden"}`}
                controls
              />
            ) : (
              <img
                src={`${PFMbaseApi}api/FileManager/downloadfile?FileName=${SelectePost.postMedia}`}
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
                <div className="flex items-center gap-1">
                  <Avatar.Group
                    maxCount={4}
                    className="flex items-center"
                    size="large"
                    maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  >
                    {/* {(() => {
                      let counter = 0;
                      if (counter < 4) {
                        if (SelectePost.likes) {
                          return SelectePost.likes.map((data) => {
                            counter++;
                            return Registers.map((dataa) => {
                              if (data.username == dataa.username) {
                                return <Avatar src={dataa.profileImg} />;
                              }
                            });
                          });
                        }
                      }
                    })()} */}
                  </Avatar.Group>
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
                        let likeStatus = SelectePost.likes.some(
                          (x) => x.username == Cookies.get("u")
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
                                LikePost(SelectePost.id);
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

                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items,
                  }}
                  placement="bottomRight"
                >
                  <FiMoreVertical className="cursor-pointer" size={iconSize} />
                </Dropdown>
              </div>
            </div>
            <div className="flex px-4  gap-2 mb-1">
              <span className=" text-xl">{SelectePost.owner}</span>
              <div
                dangerouslySetInnerHTML={{ __html: SelectePost.disc }}
                style={{ color: "white", fontSize: "20px" }}
              />
            </div>
            <div className="px-4 flex flex-col">
              <div className="flex gap-1 mb-1 text-blue-600">
                {SelectePost.tags &&
                  SelectePost.tags.map((data) => <h1>#{data}</h1>)}
              </div>
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
                    isEqual(SelectePost.comment, []) ? "h-[1rem]" : "h-[10rem]"
                  }`}
                >
                  {SelectePost.comment.map((data) => {
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
            <div className=" w-full text-right px-4 pb-2">
              <span className=" text-sm text-[#80808085]">
                °{SelectePost.time}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPostModel;
