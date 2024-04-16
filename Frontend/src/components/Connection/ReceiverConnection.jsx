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
    <div className="bg-slate-500  w-full px-2 py-1  my-4 rounded-lg flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="avatar-group  -space-x-5 rtl:space-x-reverse">
          <div className="avatar">
            <div className="h-10">
              <img src={PrifileImgReceiver} alt="" />
            </div>
          </div>
          <div className="avatar">
            <div className="h-10">
              <img src={PrifileImgSender} alt="" />
            </div>
          </div>
        </div>
        <h1>{`Send Request ${sender} To You`}</h1>
      </div>

      <div className="flex items-center  relative gap-2">
        <button
          type="button"
          class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
        >
          <svg
            class="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 18"
          >
            <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
          </svg>
          <span class="sr-only">Icon description</span>
        </button>
        <button
          style={{ transform: "rotate(180deg) scaleX(-1)" }}
          type="button"
          class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800 dark:hover:bg-red-500"
        >
          <svg
            class="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 18"
          >
            <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
          </svg>
          <span class="sr-only">Icon description</span>
        </button>
      </div>
    </div>
  );
};

export default ReceiverConnection;
