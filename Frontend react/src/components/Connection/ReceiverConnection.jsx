/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import { Dropdown } from "antd";
import React, { useEffect, useState } from "react";
import { RiQuestionMark } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  fetchConnection,
  fetchRegister,
  UpdateConnection,
} from "../../Redux/action";
import { MdOutlineTimelapse } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { FcTimeline } from "react-icons/fc";
import { motion } from "framer-motion";

const ReceiverConnection = ({
  status,
  sender,
  receiver,
  Connections,
  Change,
  change,
  dataId,
}) => {
  const [PrifileImgSender, setPrifileImgSender] = useState("");
  const [PrifileImgReceiver, setPrifileImgReceiver] = useState("");
  const Registers = useSelector((state) => state.Registers);
  const dispatch = useDispatch();

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
        <div
          className="text-[1.2rem] w-full flex flex-col items-center"
          style={{
            backgroundColor: "#282828",
            padding: "6px 10px",
            borderRadius: "6px",
          }}
        >
          <h1 className="flex items-center gap-2">
            <FcTimeline size={22} />
            Send Request {sender} to {receiver}
          </h1>
          <h1 className="flex items-center gap-2">
            {status == "send" && <MdOutlineTimelapse />}
            {status == "accept" && <FaCircle color="green" />}
            {status == "reject" && <FaCircle color="red" />}
            Stauts : {status == "send" ? "Pending..." : status}
          </h1>
        </div>
      ),
    },
  ];

  const AcceptConnection = () => {
    Connections.map(async (data) => {
      if (data.id == dataId) {
        await dispatch(
          UpdateConnection(dataId, {
            ...data,
            status: "accept",
          })
        );
        await Change("change");
        dispatch(fetchConnection());
      }
      await dispatch(fetchRegister());
    });
  };
  const RejectConnection = () => {
    Connections.map(async (data) => {
      if (data.id == dataId) {
        await dispatch(
          UpdateConnection(dataId, {
            ...data,
            status: "reject",
          })
        );
        await Change("change");
        dispatch(fetchConnection());
      }
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-500  w-full px-2 py-1  my-4 rounded-lg flex items-center justify-between gap-2"
    >
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

      {(() => {
        if (status == "send") {
          return (
            <div className="flex items-center  relative gap-2">
              <button
                onClick={AcceptConnection}
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
              </button>
              <button
                onClick={RejectConnection}
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
              </button>
            </div>
          );
        }
        if (status == "accept") {
          return (
            <div className="flex items-center  relative gap-2 cursor-pointer">
              <button
                type="button"
                class=" border  hover:text-white focus:ring-4 focus:outline-none  font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:border-gray-600 dark:text-gray-600 dark:hover:text-white dark:focus:ring-gray-700 dark:hover:bg-gray-600"
              >
                <Dropdown
                  menu={{ items }}
                  placement="bottom"
                  trigger={["click"]}
                >
                  <RiQuestionMark size={26} />
                </Dropdown>
              </button>
            </div>
          );
        }
        if (status == "reject") {
          return (
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
          );
        }
      })()}
    </motion.div>
  );
};

export default ReceiverConnection;
