import React, { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { GoFileDirectoryFill } from "react-icons/go";
import { BsFillSendFill } from "react-icons/bs";
import { MdKeyboardVoice } from "react-icons/md";

import { Avatar } from "antd";

const ChatSide = ({ SelectUser, SelectUserImg }) => {
  const [MessageText, setMessageText] = useState("");
  return (
    <div className="h-screen">
      <div className="flex justify-between items-center px-5 py-1 h-[10%] ">
        <span className="flex items-center gap-2 text-2xl">
          <Avatar src={SelectUserImg} /> {SelectUser}
        </span>
        <CiMenuKebab size={25} />
      </div>

      <div className="h-[80%] px-5 overflow-y-auto"></div>
      <div className="h-[10%] w-full flex items-center px-5">
        <div className="w-full flex justify-end items-center">
          <input
            className="w-full h-[2.4rem] bg-gray-700 rounded-[6px] px-2"
            placeholder="Type..."
            type="text"
            value={MessageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <div className="absolute flex gap-2 items-center mr-3">
            {MessageText ? (
              <BsFillSendFill size={20} className="cursor-pointer" />
            ) : (
              <>
                <GoFileDirectoryFill size={21} className="cursor-pointer" />
                <MdKeyboardVoice size={23} className="cursor-pointer" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSide;
