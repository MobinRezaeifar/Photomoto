/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { Avatar, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchRegister, updateRegister } from "../../Redux/action";
import { BsChatText } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Empty } from "antd";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Postss from "./Postss";
import Swal from "sweetalert2";

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
  const ProfileImggg = useSelector((state) => state.ProfileImg);

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
    Registers.map(async (data) => {
      if (data.username == username) {
        setConnection(data.connection.length);
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

  const ConnectionHandeling = async () => {
    Registers.map(async (data) => {
      if (data.username == username) {
        await dispatch(
          updateRegister(data.id, {
            ...data,
            connection: [
              ...data.connection,
              {
                username: decryptAES(sessionStorage.getItem("u")),
                profileImg: ProfileImggg,
              },
            ],
          })
        );
      }
      await dispatch(fetchRegister());
      if (data.username == decryptAES(sessionStorage.getItem("u"))) {
        await dispatch(
          updateRegister(data.id, {
            ...data,
            connection: [
              ...data.connection,
              {
                username,
                profileImg: ProfileImg,
              },
            ],
          })
        );
      }
    });
    await dispatch(fetchRegister());
  };

  const GoDirect = () => {
    Registers.map((data) => {
      if (data.username == username) {
        let status = data.connection.some(
          (x) => x.username == decryptAES(sessionStorage.getItem("u"))
        );
        if (status) {
          navigate("/photomoto");
          console.log(status);
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
            {Registers.map((data) => {
              if (data.username == decryptAES(sessionStorage.getItem("u"))) {
                let ConnectionStatus = data.connection.some(
                  (x) => x.username == username
                );
                if (ConnectionStatus) {
                  return (
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
                      className="bg-slate-600 cursor-pointer"
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/cvmfhtvr.json"
                        trigger="hover"
                        colors="primary:lightgreen,secondary:lightgreen"
                        style={{ transform: "scale(1.3)" }}
                      ></lord-icon>
                    </div>
                  );
                } else {
                  return (
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
                      className="bg-slate-600 cursor-pointer"
                      onClick={async () => {
                        await ConnectionHandeling();
                        await dispatch(fetchRegister());
                      }}
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/cvmfhtvr.json"
                        trigger="hover"
                        colors="primary:#e4e4e4,secondary:#e4e4e4"
                        style={{ transform: "scale(1.3)" }}
                      ></lord-icon>
                    </div>
                  );
                }
              }
            })}

            <div
              style={{
                boxShadow: "1px 3px 13px rgba(0, 0, 0, 0.427)",
                // backgroundColor: "red",
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
