/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { Avatar, Badge, Spin } from "antd";
import { BiSolidAddToQueue } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import { Button, Upload } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import CreatePostModel from "../Me/CreatePostModel";
import { Empty } from "antd";
import Postss from "../Global/Postss";
import SettingSideBar from "../Me/SettingSideBar";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";

const Me = ({ Change, change }) => {
  const PUMbaseApi = useSelector((state) => state.PUMbaseApi);
  const PFMbaseApi = useSelector((state) => state.PFMbaseApi);
  const PPMbaseApi = useSelector((state) => state.PPMbaseApi);
  const [SelecteTab, setSelecteTab] = useState("posts");
  const [Post, setPost] = useState();
  const [User, setUser] = useState({});
  const [Connection, setConnection] = useState();
  const [Posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  let mainUser = Cookies.get("u");
  const [ShowSettingSidebar, setShowSettingSidebar] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [ShowCreatePostModel, setShowCreatePostModel] = useState(false);
  const headers = {
    Authorization: `Bearer ${Cookies.get("jwt")}`,
    "Content-Type": "application/json",
  };
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

  const GetData = async () => {
    try {
      const [connectionRes, postRes, userRes, postsRes] = await Promise.all([
        axios.get(
          `${PUMbaseApi}Connection/v1/api/relations?username=${mainUser}&status=accept`,
          { headers }
        ),
        axios.get(`${PPMbaseApi}Post/v1/api/PostCount?owner=${mainUser}`, {
          headers,
        }),
        axios.get(
          `${PUMbaseApi}Register/v1/api/GetByUsername?username=${mainUser}`,
          { headers }
        ),
        axios.get(`${PPMbaseApi}Post/v1/api/Owner?owner=${mainUser}`, {
          headers,
        }),
      ]);

      setConnection(connectionRes.data.length);
      setPost(postRes.data);
      setUser(userRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      console.error("Error occurred during the API call:", error);
    } finally {
      setLoading(false);
    }
  };

  let fileName = Date.now().toString() + ".png";
  const handleChangeProfile = async (info) => {
    if (info) {
      try {
        await axios.patch(
          `${PUMbaseApi}Register/v1/api/UpdateRegisterByUsername?username=${mainUser}`,
          {
            profileImg: fileName,
          },
          { headers }
        );
        await GetData();
        var form = new FormData();
        form.append("file", info.file.originFileObj, fileName);
        await axios.post(`${PFMbaseApi}api/FileManager/uploadfile`, form);
        await GetData();
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    GetData();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      GetData();
    }, 1000);
    GetData();
  }, [change]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <div role="status" class="max-w-sm p-4  rounded  animate-pulse md:p-6 ">
          <div class="flex items-center mb-4">
            <svg
              class="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <div>
              <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
              <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
          <div class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
            <svg
              class="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 20"
            >
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            </svg>
          </div>
          <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>

          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="flex justify-between w-full items-center p-8">
        <span
          className={`${
            dimensions.width > 900 ? "text-4xl" : "text-2xl"
          } font-[600]`}
        >
          {User.username}
        </span>
        <span className="flex items-center gap-2">
          <BiSolidAddToQueue
            onClick={() => {
              setShowCreatePostModel(true);
            }}
            title="Create Post"
            className="animated2 cursor-pointer"
            size={dimensions.width > 900 ? 38 : 32}
          />

          <IoSettingsOutline
            onClick={() => setShowSettingSidebar(true)}
            title="Setting"
            className="animated cursor-pointer"
            size={dimensions.width > 900 ? 38 : 32}
          />
          <CreatePostModel
            GetData={GetData}
            Change={Change}
            change={change}
            mainUser={mainUser}
            show={ShowCreatePostModel}
            setShow={setShowCreatePostModel}
            dimensions={dimensions}
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
            <Upload accept="image/*" onChange={(e) => handleChangeProfile(e)}>
              <Button
                title="Add Profile Image"
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
          {User && (
            <Avatar
              size={dimensions.width > 900 ? 120 : 80}
              src={
                User.profileImg ==
                "https://wallpapercave.com/dwp1x/wp9566386.jpg"
                  ? User.profileImg
                  : `${PFMbaseApi}api/FileManager/downloadfile?FileName=${User.profileImg}`
              }
              shape="circle"
            />
          )}
        </Badge>

        <div
          className={`flex justify-between gap-4 items-center ${
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
      <div className="px-10 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-serif text-white">{User.fullName}</span>
          <span>{User.bio}</span>
        </div>
      </div>
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
      <div className="px-8 py-4 w-full">
        {(() => {
          if (SelecteTab == "posts") {
            if (Post == 0) {
              return <Empty description="There Are No Posts" />;
            } else {
              return (
                <Postss
                  Posts={Posts}
                  headers={headers}
                  mainUser={mainUser}
                  dimensions={dimensions}
                  User={User}
                  Change={Change}
                  change={change}
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
      <SettingSideBar
        ShowSettingSidebar={ShowSettingSidebar}
        setShowSettingSidebar={setShowSettingSidebar}
        dimensions={dimensions}
        User={User}
        Change={Change}
        headers={headers}
      />
    </div>
  );
};

export default Me;
