import React from "react";
import { IoSettingsOutline } from "react-icons/io5";

const SettingSideBar = ({
  ShowSettingSidebar,
  setShowSettingSidebar,
  dimensions,
}) => {
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
      <div>
        
      </div>
    </div>
  );
};

export default SettingSideBar;
