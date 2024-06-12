/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { SiSendinblue } from "react-icons/si";
import { FcEditImage, FcSettings } from "react-icons/fc";
import { Avatar, Badge, Button } from "antd";
import { IoIosAddCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ShowPostModel from "../Global/ShowPostModel";
import CryptoJS from "crypto-js";
import ShowStoriesModel from "../Home/ShowStoriesModel";
import {
  fetchConnection,
  fetchPosts,
  fetchRegister,
  fetchStory,
} from "../../Redux/action";

const Home = ({ change, Change }) => {
  const [mappedData, setmappedData] = useState([]);
  const [SelectePost, setSelectePost] = useState("");
  const Posts = useSelector((state) => state.Posts);
  const Registers = useSelector((state) => state.Registers);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ProfileImg = useSelector((state) => state.ProfileImg);
  const [StoryOwner, setStoryOwner] = useState("");
  const [ShowStoryModel, setShowStoryModel] = useState(false);
  const Stories = useSelector((state) => state.Stories);
  const Connections = useSelector((state) => state.Connections);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateSize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
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
  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      if (window) {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

  const FetchData = () => {
    Connections.map((data) => {
      if (
        data.sender == decryptAES(sessionStorage.getItem("u")) ||
        data.receiver == decryptAES(sessionStorage.getItem("u"))
      ) {
        if (data.status == "accept") {
          Posts.map((post) => {
            if (post.owner == data.sender || post.owner == data.receiver) {
              if (!mappedData.includes(post)) {
                if (post.owner != decryptAES(sessionStorage.getItem("u"))) {
                  return mappedData.push(post);
                }
              }
            }
          });
        }
      }
    });
  };

  useEffect(() => {
    FetchData();
    dispatch(fetchStory());
    dispatch(fetchRegister());
    dispatch(fetchPosts());
    dispatch(fetchConnection());
  }, []);
  useEffect(() => {
    dispatch(fetchStory());
  }, [change]);

  return (
    <div className="h-full pb-10 md:pb-0 overflow-y-auto w-full  px-6 py-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="flex text-2xl font-bold gap-1 items-center">
          <SiSendinblue size={30} />
          Photomoto
        </h1>
        <div className="flex items-center gap-2">
          <FcSettings size={30} />
          <FcEditImage size={30} />
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(128, 128, 128, 0.163)",
          margin: "15px 0.5rem",
        }}
      />
      <div className="h-20  w-full overflow-x-auto flex gap-2 items-center">
        <Badge
          className="cursor-pointer"
          count={
            <Button
              title="Add Story"
              id="borderrnone"
              icon={
                <IoIosAddCircle
                  onClick={() => navigate("createStory")}
                  color="lightgreen"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "2px",
                  }}
                  size={20}
                />
              }
            />
          }
        >
          <Avatar
            size={70}
            src={ProfileImg}
            shape="circle"
            onClick={() => {
              let status = Stories.some(
                (x) => x.owner == decryptAES(sessionStorage.getItem("u"))
              );
              if (status) {
                setShowStoryModel(true);
                setStoryOwner(decryptAES(sessionStorage.getItem("u")));
              }
            }}
          />
        </Badge>
        {(() => {
          return Connections.map((data) => {
            let mainUser;
            if (data.sender == decryptAES(sessionStorage.getItem("u"))) {
              mainUser = data.receiver;
            }
            if (data.receiver == decryptAES(sessionStorage.getItem("u"))) {
              mainUser = data.sender;
            }

            let ThereIsAStory = Stories.some((x) => x.owner == mainUser);
            if (ThereIsAStory) {
              let ProfileImage;
              Registers.map((z) => {
                if (z.username == mainUser) {
                  ProfileImage = z.profileImg;
                }
              });
              const uniqueStories = Stories.filter(
                (story, index, self) =>
                  self.findIndex((s) => s.owner === story.owner) === index
              );

              return uniqueStories.map((y) => {
                if (y.owner == mainUser) {
                  return (
                    <Badge key={y.owner} className="cursor-pointer">
                      <Avatar
                        size={70}
                        src={ProfileImage}
                        shape="circle"
                        onClick={() => {
                          setShowStoryModel(true);
                          setStoryOwner(y.owner);
                        }}
                      />
                    </Badge>
                  );
                }
              });
            }
          });
        })()}
      </div>

      <div id="instagram" style={{ padding: "20px 0" }}>
        <div className="grid  grid-cols-2 sm:grid-cols-4 2xl:grid-cols-6">
          {mappedData.map((post, index) => {
            return (
              <div
                onClick={() => {
                  dispatch({
                    type: "SHOWPOSTMODEL",
                    payload: true,
                  });
                  setSelectePost(post.id);
                }}
                className="col-span-1 cursor-pointer"
                key={index}
              >
                <a target="_blank">
                  {post.type.startsWith("video") ? (
                    <motion.video
                      className={`box-${index}`}
                      style={{
                        border: "1px solid #4d4c4c",
                        backgroundSize: "100%",
                      }}
                      src={post.postMedia}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    />
                  ) : (
                    <motion.div
                      className={`box-${index} bg-cover`}
                      style={{
                        backgroundImage: `url(${post.postMedia})`,
                        border: "1px solid #4d4c4c",
                        backgroundPosition: "center",
                        backgroundRepeat: " no-repeat",
                        backgroundSize: "cover",
                      }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    ></motion.div>
                  )}
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <ShowPostModel
        dimensions={dimensions}
        Posts={Posts}
        SelectePost={SelectePost}
      />
      <ShowStoriesModel
        mainUser={decryptAES(sessionStorage.getItem("u"))}
        change={change}
        Change={Change}
        setShow={setShowStoryModel}
        show={ShowStoryModel}
        dimensions={dimensions}
        owner={StoryOwner}
      />
    </div>
  );
};

export default Home;
