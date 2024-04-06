import React from "react";
import { SiSendinblue } from "react-icons/si";
import { FcEditImage, FcSettings } from "react-icons/fc";
import { Avatar, Badge, Button, Upload } from "antd";
import { IoIosAddCircle } from "react-icons/io";
import { useSelector } from "react-redux";

const Home = () => {
  const handleChange = () => {};
  const ProfileImg = useSelector((state) => state.ProfileImg);

  return (
    <div className="h-full pb-10 md:pb-0 overflow-y-auto w-full  px-6 py-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="flex text-xl font-bold gap-1 items-center">
          <SiSendinblue size={25} />
          Photomoto
        </h1>
        <div className="flex items-center gap-2">
          <FcSettings size={25} />
          <FcEditImage size={25} />
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(128, 128, 128, 0.163)",
          margin: "10px 1.5rem",
        }}
      />
      <div className="h-20 ">
        <Badge
          count={
            <Upload onChange={(e) => handleChange(e)}>
              <Button
              title="Add Story"
                id="borderrnone"
                icon={
                  <IoIosAddCircle
                    color="lightgreen"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "2px",
                    }}
                    size={20}
                  />
                }
              ></Button>
            </Upload>
          }
        >
          <Avatar size={70} src={ProfileImg} shape="circle" />
        </Badge>
      </div>
    </div>
  );
};

export default Home;
