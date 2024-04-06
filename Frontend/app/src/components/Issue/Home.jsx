import React from "react";
import { SiSendinblue } from "react-icons/si";
import { FcEditImage, FcSettings } from "react-icons/fc";
import { Avatar, Badge, Button, Upload } from "antd";
import { IoIosAddCircle } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const ProfileImg = useSelector((state) => state.ProfileImg);

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
      <div className="h-20  w-full overflow-x-auto flex items-center">
        <Badge
          onClick={() => navigate("createStoty")}
          className="cursor-pointer"
          count={
            <Button
              title="Add Story"
              id="borderrnone"
              icon={
                <IoIosAddCircle
                  color="lightgreen"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "2px",
                  }}
                  size={20}
                />
              }
            ></Button>
          }
        >
          <Avatar size={70} src={ProfileImg} shape="circle" />
        </Badge>
      </div>
    </div>
  );
};

export default Home;
