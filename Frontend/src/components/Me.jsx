import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { IoSettingsOutline } from "react-icons/io5";
import { Avatar, Badge } from "antd";
import { BiSolidAddToQueue } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";

const props = {
  name: "file",
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const Me = () => {
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
      <div className="px-6 pt-4 ">
        <Badge
          // count={}
          count={
            <Upload {...props}>
              <Button  id="borderrnone" icon={<IoIosAddCircle color="#4096ff" style={{position:"absolute",top:"10px",right:"2px"}} size={dimensions.width > 900 ? 30 : 20}/>}></Button>
            </Upload>
          }
        >
          <Avatar
            size={dimensions.width > 900 ? 120 : 80}
            src="https://wallpapercave.com/wp/wp9566386.jpg"
            shape="circle"
          />
        </Badge>
      </div>
    </div>
  );
};

export default Me;
