import React from "react";

const SettingSideBar = ({ ShowSettingSidebar }) => {
  return (
    <div
      className={`${
        ShowSettingSidebar ? "fixed" : "hidden "
      } top-0 h-full w-[50%] right-0 bg-base-300`}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia quis eum
      pariatur fugiat autem sit impedit. Velit officiis vel ea deleniti
      doloremque? Consequatur totam vitae inventore, at tempore libero
      necessitatibus.
    </div>
  );
};

export default SettingSideBar;
