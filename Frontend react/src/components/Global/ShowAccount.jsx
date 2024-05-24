/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { Avatar, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  AddConnection,
  deleteConnection,
  fetchConnection,
  fetchRegister,
  UpdateConnection,
} from "../../Redux/action";
import { BsChatText } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Empty } from "antd";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Postss from "./Postss";
import Swal from "sweetalert2";
import moment from "jalali-moment";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { MdAvTimer } from "react-icons/md";
import { RiUserFollowFill, RiUserUnfollowFill } from "react-icons/ri";

const ShowAccount = () => {
  const { username } = useParams();
  const Registers = useSelector((state) => state.Registers);
  const [SelecteTab, setSelecteTab] = useState("posts");
  const dispatch = useDispatch();
  const [ProfileImg, setProfileImg] = useState("");
  const [Post, setPost] = useState(0);
  const [Connection, setConnection] = useState(0);
  const [Bio, setBio] = useState("");
  const [FullName, setFullName] = useState("");
  const Connections = useSelector((state) => state.Connections);
  const baseUrlDotenet = useSelector((state) => state.baseUrlDotenet);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    dispatch(fetchRegister());
  }, []);

  useEffect(() => {
    dispatch(fetchRegister());
  }, [dispatch]);

  const updateSize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      if (window) {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

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
  let mainUser = decryptAES(sessionStorage.getItem("u"));

  useEffect(() => {
    let lenghtt = [];
    Connections.map((data) => {
      if (data.sender == username || data.receiver == username) {
        if (data.status == "accept") {
          lenghtt.push(data);
          return setConnection(lenghtt.length);
        }
      }
    });
    Registers.map(async (data) => {
      if (data.username == username) {
        setPost(data.post);
        setBio(data.bio);
        setFullName(data.fullName);
        if (data.profileImg) {
          setProfileImg(data.profileImg);
        } else {
          setProfileImg("https://wallpapercave.com/dwp1x/wp9566386.jpg");
        }
      }
    });
  });

  const navigate = useNavigate();

  const GoDirect = () => {
    Connections.map((data) => {
      if (data.sender == username || data.receiver == username) {
        if (data.status == "accept") {
          navigate("/photomoto");
          dispatch({
            type: "ISSUE",
            payload: "direct",
          });
          dispatch({
            type: "SELECTUSERCHAT",
            payload: username,
          });
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "error",
            title: "Connect First",
          });
        }
      }
    });
  };

  const now = Date.now();

  const [change, setchange] = useState([]);

  const Change = async (change) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(`${baseUrlDotenet}change`)
        .configureLogging(LogLevel.Information)
        .build();
      await connection.start();

      connection.invoke("Connect", change).catch((err) => console.error(err));

      connection.on("getChange", (chang) => {
        setchange(chang);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handelConnection = async () => {
    let ConnectionStatus = Connections.some(
      (x) =>
        x.relation ==
          decryptAES(sessionStorage.getItem("u")) + "," + username ||
        x.relation == username + "," + decryptAES(sessionStorage.getItem("u"))
    );
    if (!ConnectionStatus) {
      await dispatch(
        AddConnection({
          id: Date.now() + "",
          sender: decryptAES(sessionStorage.getItem("u")),
          receiver: username,
          time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
          status: "send",
          relation: decryptAES(sessionStorage.getItem("u")) + "," + username,
        })
      );
      await Change("change");
    }
  };
  const AcceptConnection = (id) => {
    Connections.map(async (data) => {
      if (data.id == id) {
        await dispatch(
          UpdateConnection(id, {
            ...data,
            status: "accept",
          })
        );
        await Change("change");
      }
    });
  };
  const RejectConnection = (id) => {
    Connections.map(async (data) => {
      if (data.id == id) {
        await dispatch(
          UpdateConnection(id, {
            ...data,
            status: "reject",
          })
        );
        await Change("change");
      }
    });
  };
  const DisConnect = (connectionId) => {
    dispatch(deleteConnection(connectionId));
  };
  useEffect(() => {
    dispatch(fetchConnection());
  }, [change]);

  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="flex justify-between w-full items-center  p-8">
        <span
          className={`${
            dimensions.width > 900 ? "text-4xl" : "text-2xl"
          } font-[600] flex items-center gap-2`}
        >
          <FaArrowLeft
            className="cursor-pointer"
            onClick={() => navigate("/photomoto")}
          />{" "}
          {username}
        </span>
        {/* <span className="flex items-center gap-2">
          <BiSolidAddToQueue
            onClick={() => {
              // navigate("/photomoto/edit");
              setShowCreatePostModel(true);
            }}
            title="Create Post"
            className="animated2 cursor-pointer"
            size={dimensions.width > 900 ? 38 : 32}
            // style={{ marginTop: "1.9rem" }}
          />
          <IoSettingsOutline
            title="Setting"
            className="animated cursor-pointer"
            size={dimensions.width > 900 ? 38 : 32}
            // style={{ marginTop: "1.9rem" }}
          />
          <CreatePostModel
            show={ShowCreatePostModel}
            setShow={setShowCreatePostModel}
            dimensions={dimensions}
            ProfileImg={ProfileImg}
          />
        </span> */}
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(128, 128, 128, 0.163)",
          margin: "0 1rem",
        }}
      />
      <div className="px-8 pt-4 flex justify-between">
        <Avatar
          size={dimensions.width > 900 ? 120 : 80}
          src={ProfileImg}
          shape="circle"
        />
        <div
          className={`flex justify-between gap-4  items-center ${
            dimensions.width > 900 ? "text-2xl" : "text-xl"
          }`}
          style={{ marginTop: dimensions.width > 900 ? "-40px" : "-20px" }}
        >
          <div className="flex flex-col justify-center items-center">
            <span>{Post}</span>
            <span>Post</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span>{Connection}</span> <span>Connection</span>
          </div>
        </div>
      </div>
      <div className="px-10 py-4 flex items-center justify-between ">
        <div className="flex flex-col">
          <span className="text-xl font-serif text-white">{FullName}</span>
          <span>{Bio}</span>
        </div>
        {username != mainUser && (
          <div className="flex gap-2">
            {(() => {
              if (username != decryptAES(sessionStorage.getItem("u"))) {
                let ConnectionStatus = Connections.some(
                  (x) =>
                    x.relation ==
                      decryptAES(sessionStorage.getItem("u")) +
                        "," +
                        username ||
                    x.relation ==
                      username + "," + decryptAES(sessionStorage.getItem("u"))
                );
                if (ConnectionStatus) {
                  return Connections.map((data) => {
                    if (data.sender == username || data.receiver == username) {
                      if (data.status == "send") {
                        if (
                          data.sender == decryptAES(sessionStorage.getItem("u"))
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
            })()}

            <div
              style={{
                boxShadow: "1px 3px 13px rgba(0, 0, 0, 0.427)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="bg-slate-600 cursor-pointer "
              onClick={GoDirect}
            >
              <BsChatText size={27} className="animated3" />
            </div>
          </div>
        )}
      </div>

      {/*  */}

      <div className="flex justify-center text-center px-8 mb-2">
        <div
          className="w-1/2 cursor-pointer"
          onClick={() => {
            setSelecteTab("posts");
          }}
        >
          <span className="text-white"> Posts</span>
          <div
            className="mt-2"
            style={{
              borderTop:
                SelecteTab == "posts"
                  ? "1px solid white"
                  : "1px solid rgba(128, 128, 128, 0.163)",
            }}
          />
        </div>
        <div
          className="w-1/2 cursor-pointer"
          onClick={() => {
            setSelecteTab("others");
          }}
        >
          <span className="text-white">Others</span>
          <div
            className="mt-2"
            style={{
              borderTop:
                SelecteTab == "others"
                  ? "1px solid white"
                  : "1px solid rgba(128, 128, 128, 0.163)",
            }}
          />
        </div>
      </div>
      {/*  */}
      <div className="px-8 py-4 w-full">
        {(() => {
          if (SelecteTab == "posts") {
            if (Post == 0) {
              return <Empty description="There Are No Posts" />;
            } else {
              return (
                <Postss
                  mainUser={username}
                  dimensions={dimensions}
                  ProfileImg={ProfileImg}
                />
              );
            }
          } else {
            return (
              <h1>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Officia officiis assumenda veritatis ipsam, sequi nihil numquam
                quis quibusdam. Recusandae beatae error harum a, cum pariatur
                mollitia porro nobis nesciunt aliquam?
              </h1>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default ShowAccount;
