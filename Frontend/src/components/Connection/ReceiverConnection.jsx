/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ReceiverConnection = ({ status, sender, receiver }) => {
  const [PrifileImgSender, setPrifileImgSender] = useState("");
  const [PrifileImgReceiver, setPrifileImgReceiver] = useState("");
  const Registers = useSelector((state) => state.Registers);

  useEffect(() => {
    Registers.map((data) => {
      if (data.username == sender) setPrifileImgSender(data.profileImg);
      if (data.username == receiver) setPrifileImgReceiver(data.profileImg);
    });
  });

  return (
    <div className="bg-slate-500  w-full px-2 py-1  my-4 rounded-lg">
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
    </div>
  );
};

export default ReceiverConnection;
