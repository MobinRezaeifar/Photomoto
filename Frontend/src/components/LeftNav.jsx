import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { IoChatbubbleEllipsesOutline, IoHome } from "react-icons/io5";
import { MdConnectWithoutContact } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const LeftNav = () => {
  const dispatch = useDispatch();
  const Issue = useSelector((state) => state.Issue);

  return (
    <div
      className="w-[4%] h-full flex flex-col gap-3 items-center p-4 justify-around bg-[#37415171] absolute left-0"
      style={{ borderRadius: "0 6px  6px 0" }}
    >
      <FaUserAlt
        className={`hover:bg-gray-700 ${Issue == "me" && "bg-gray-700"}`}
        size={32}
        style={{ cursor: "pointer", borderRadius: "50%", padding: "3px" }}
        onClick={() => {
          dispatch({
            type: "ISSUE",
            payload: "me",
          });
        }}
      />
      <MdConnectWithoutContact
       className={`hover:bg-gray-700 ${Issue == "connection" && "bg-gray-700"}`}
       size={32}
       style={{ cursor: "pointer", borderRadius: "50%", padding: "3px" }}
        onClick={() => {
          dispatch({
            type: "ISSUE",
            payload: "connection",
          });
        }}
      />
      <GoSearch
        className={`hover:bg-gray-700 ${Issue == "search" && "bg-gray-700"}`}
        size={32}
        style={{ cursor: "pointer", borderRadius: "50%", padding: "3px" }}
        onClick={() => {
          dispatch({
            type: "ISSUE",
            payload: "search",
          });
        }}
      />
      <IoChatbubbleEllipsesOutline
        className={`hover:bg-gray-700 ${Issue == "chat" && "bg-gray-700"}`}
        size={32}
        style={{ cursor: "pointer", borderRadius: "50%", padding: "3px" }}
        onClick={() => {
          dispatch({
            type: "ISSUE",
            payload: "chat",
          });
        }}
      />
      <IoHome
        className={`hover:bg-gray-700 ${Issue == "home" && "bg-gray-700"}`}
        size={32}
        style={{ cursor: "pointer", borderRadius: "50%", padding: "3px" }}
        onClick={() => {
          dispatch({
            type: "ISSUE",
            payload: "home",
          });
        }}
      />
    </div>
  );
};

export default LeftNav;
