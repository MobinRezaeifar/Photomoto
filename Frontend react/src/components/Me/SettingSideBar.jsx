import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { Collapse } from "antd";
import { MdOutlineDescription } from "react-icons/md";
import { RxFontFamily } from "react-icons/rx";
import { useState } from "react";

const SettingSideBar = ({
  ShowSettingSidebar,
  setShowSettingSidebar,
  dimensions,
  bio,
  username,
  fullName,
  email,
}) => {
  const [Username, setUsername] = useState(username);
  const [FullName, setFullName] = useState(fullName);
  const [Email, setEmail] = useState(email);
  const [Bio1, setBio1] = useState(bio);

  const items = [
    {
      key: "1",
      label: "Edit Profile Detail",
      children: (
        <>
          <label
            for="website-admin"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <div class="flex  mb-4">
            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
            </span>
            <input
              value={Username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              id="website-admin"
              class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="elonmusk"
            />
          </div>
          <label
            for="website-admin"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            FullName
          </label>
          <div class="flex  mb-4">
            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <RxFontFamily size={20} />
            </span>
            <input
              value={FullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              type="text"
              id="website-admin"
              class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="elonmusk"
            />
          </div>
          <label
            for="website-admin"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <div class="flex  mb-4">
            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400 bg-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </span>
            <input
              value={Email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="text"
              id="website-admin"
              class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="elonmusk"
            />
          </div>

          <label
            for="website-admin"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Bio
          </label>
          <div class="flex  mb-4">
            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              <MdOutlineDescription size={20} />
            </span>
            <input
              value={Bio1}
              onChange={(e) => {
                setBio1(e.target.value);
              }}
              type="text"
              id="website-admin"
              class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="elonmusk"
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <div
      className={`${
        ShowSettingSidebar ? "fixed" : "hidden "
      } top-0   right-0 bg-base-300 rounded-s-3xl p-4 overflow-y-auto`}
      style={{
        height: dimensions.width > 900 ? "100%" : "93%",
        width: dimensions.width > 900 ? "50%" : "100%",
      }}
    >
      <div
        className="flex items-center text-xl gap-2 cursor-pointer"
        onClick={() => setShowSettingSidebar(false)}
      >
        <IoSettingsOutline
          title="Setting"
          className="animated cursor-pointer"
          size={32}
        />
        Setting
      </div>
      <br />
      <Collapse accordion items={items} />
    </div>
  );
};

export default SettingSideBar;
