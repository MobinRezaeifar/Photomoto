import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SlQuestion } from "react-icons/sl";
import { RiQuestionMark } from "react-icons/ri";
import { Dropdown } from "antd";

const SendConnection = ({ status, sender, receiver }) => {
  const [PrifileImgSender, setPrifileImgSender] = useState("");
  const [PrifileImgReceiver, setPrifileImgReceiver] = useState("");
  const Registers = useSelector((state) => state.Registers);

  useEffect(() => {
    Registers.map((data) => {
      if (data.username == sender) setPrifileImgSender(data.profileImg);
      if (data.username == receiver) setPrifileImgReceiver(data.profileImg);
    });
  });

  const items = [
    {
      key: "1",
      label: (
        <div className="text-[1.2rem] w-full">
          <h1>
            Send Request {sender} to {receiver}
          </h1>
          <h1>Staus : {status == "send" ? "Pending..." : status}</h1>
        </div>
      ),
    },
  ];
  return (
    <div className="bg-slate-500  w-full px-2 py-1  my-4 rounded-lg flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="avatar-group  -space-x-5 rtl:space-x-reverse">
          <div className="avatar">
            <div className="h-10">
              <img src={PrifileImgSender} alt="" />
            </div>
          </div>
          <div className="avatar">
            <div className="h-10">
              <img src={PrifileImgReceiver} alt="" />
            </div>
          </div>
        </div>
        <h1>{`You Send Request To ${receiver}`}</h1>
      </div>
      <div className="flex items-center  relative gap-2 cursor-pointer">
        <button
          type="button"
          class=" border  hover:text-white focus:ring-4 focus:outline-none  font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:border-gray-600 dark:text-gray-600 dark:hover:text-white dark:focus:ring-gray-700 dark:hover:bg-gray-600"
        >
          <Dropdown
            menu={{ items }}
            placement="bottom"
            arrow
            trigger={["click"]}
          >
            <RiQuestionMark size={26} />
          </Dropdown>
        </button>
      </div>
    </div>
  );
};

export default SendConnection;
