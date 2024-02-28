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
import { fetchRegister, updateRegister } from "../Redux/action";

const Me = ({ Change, change }) => {
  const Registers = useSelector((state) => state.Registers);
  const dispatch = useDispatch();
  const [ProfileImg, setProfileImg] = useState("");

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    dispatch(fetchRegister());
  }, [change]);
  useEffect(() => {
    dispatch(fetchRegister());
  }, []);

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

  const handleChange = async (info) => {
    if (info) {
      try {
        Registers.map(async (data) => {
          if (data.username == decryptAES(sessionStorage.getItem("u"))) {
            await dispatch(
              updateRegister(data.id, {
                id: data.id,
                username: data.username,
                password: data.password,
                profileImg: info.file.originFileObj.name,
                email: data.email,
                role: data.role,
                hash: data.hash,
              })
            );
          }
        });
        var form = new FormData();
        form.append("file", info.file.originFileObj);
        await axios.post(
          "https://localhost:7028/api/FileManager/uploadfile",
          form
        );
        await Change("change");
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    Registers.map((data) => {
      if (data.username == decryptAES(sessionStorage.getItem("u"))) {
        if (data.profileImg) {
          setProfileImg(
            `https://motionsbackend.liara.run/api/FileManager/downloadfile?FileName=${data.profileImg}`
          );
        } else {
          setProfileImg("https://wallpapercave.com/dwp1x/wp9566386.jpg");
        }
      }
    });
  });

  return (
    <div className="h-[100vh] overflow-y-auto w-full ">
      <div className="flex justify-between w-full items-center  p-6">
        <span
          className={`${
            dimensions.width > 900 ? "text-4xl" : "text-2xl"
          } font-[600]`}
        >
          {decryptAES(sessionStorage.getItem("u"))}
        </span>
        <span className="flex items-center gap-1">
          <BiSolidAddToQueue
            className="animated2"
            size={dimensions.width > 900 ? 38 : 32}
            // style={{ marginTop: "1.9rem" }}
          />
          <IoSettingsOutline
            className="animated"
            size={dimensions.width > 900 ? 38 : 32}
            // style={{ marginTop: "1.9rem" }}
          />
        </span>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(128, 128, 128, 0.163)",
          margin: "0 1rem",
        }}
      />
      <div className="px-6 pt-4 flex justify-between">
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

        <div className="flex">
          <div className="flex flex-col">
            <span>Connection</span> <span>9999</span>
          </div>
          <div className="flex flex-col">
            <span>Connection</span> <span>9999</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Me;
