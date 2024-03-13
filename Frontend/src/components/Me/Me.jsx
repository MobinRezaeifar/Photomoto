/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { IoSettingsOutline } from "react-icons/io5";
import { Avatar, Badge } from "antd";
import { BiSolidAddToQueue } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchPosts,
  fetchRegister,
  updatePost,
  updateRegister,
} from "../../Redux/action";
import { BsChatText } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CreatePostModel from "./CreatePostModel";
import MePosts from "../MePosts";
import { Empty } from "antd";

const Me = () => {
  const Registers = useSelector((state) => state.Registers);
  const Posts = useSelector((state) => state.Posts);
  const [SelecteTab, setSelecteTab] = useState("posts");
  const dispatch = useDispatch();
  const [ProfileImg, setProfileImg] = useState("");
  const [Post, setPost] = useState(0);
  const [Connection, setConnection] = useState(0);
  const [Bio, setBio] = useState("");
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
      window.removeEventListener("resize", updateSize);
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

  const handleChange = async (info) => {
    if (info) {
      try {
        Posts.map(async (data) => {
          if (data.owner == mainUser) {
            await dispatch(
              updatePost(data.id, {
                ...data,
                profileImg:
                  "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                  info.file.originFileObj.name,
              })
            );
          }
        });
        Registers.map(async (data) => {
          if (data.username == mainUser) {
            await dispatch(
              updateRegister(data.id, {
                ...data,
                profileImg:
                  "http://localhost:5221/api/FileManager/downloadfile?FileName=" +
                  info.file.originFileObj.name,
              })
            );

            await dispatch(fetchRegister());
          }
        });
        var form = new FormData();
        form.append("file", info.file.originFileObj);
        await axios.post(
          "http://localhost:5221/api/FileManager/uploadfile",
          form
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    Registers.map(async (data) => {
      if (data.username == decryptAES(sessionStorage.getItem("u"))) {
        setConnection(data.connection.length);
        setPost(data.post);
        setBio(data.bio);
        if (data.profileImg) {
          setProfileImg(data.profileImg);
        } else {
          setProfileImg("https://wallpapercave.com/dwp1x/wp9566386.jpg");
        }
      }
    });
  });

  const navigate = useNavigate();
  const [ShowCreatePostModel, setShowCreatePostModel] = useState(false);



  return (
    <div className="h-full overflow-y-auto w-full ">
      <div className="flex justify-between w-full items-center  p-8">
        <span
          className={`${
            dimensions.width > 900 ? "text-4xl" : "text-2xl"
          } font-[600]`}
        >
          {decryptAES(sessionStorage.getItem("u"))}
        </span>
        <span className="flex items-center gap-2">
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
        </span>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(128, 128, 128, 0.163)",
          margin: "0 1rem",
        }}
      />
      <div className="px-8 pt-4 flex justify-between">
        <Badge
          count={
            <Upload onChange={(e) => handleChange(e)}>
              <Button
                id="borderrnone"
                icon={
                  <IoIosAddCircle
                    color="#4096ff"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "2px",
                    }}
                    size={dimensions.width > 900 ? 30 : 20}
                  />
                }
              ></Button>
            </Upload>
          }
        >
          <Avatar
            size={dimensions.width > 900 ? 120 : 80}
            src={ProfileImg}
            shape="circle"
          />
        </Badge>

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
          <span className="text-xl font-serif text-white">
            {decryptAES(sessionStorage.getItem("f"))}
          </span>
          <span>{Bio}</span>
        </div>
        {decryptAES(sessionStorage.getItem("u")) != mainUser && (
          <div className="flex gap-2">
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
              className="bg-slate-600 cursor-pointer"
            >
              <lord-icon
                
                src="https://cdn.lordicon.com/cvmfhtvr.json"
                trigger="hover"
                colors="primary:#e4e4e4,secondary:#e4e4e4"
                style={{ transform: "scale(1.3)" }}
              ></lord-icon>
            </div>
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
                <MePosts
                  mainUser={mainUser}
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

export default Me;
