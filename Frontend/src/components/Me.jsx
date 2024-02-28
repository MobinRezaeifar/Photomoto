import React from "react";
import CryptoJS from "crypto-js";
import { FcSettings } from "react-icons/fc";
import { IoSettingsOutline } from "react-icons/io5";

const Me = () => {
  const key = CryptoJS.enc.Utf8.parse("1234567890123456");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456");

  function decryptAES(message) {
    const bytes = CryptoJS.AES.decrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  return (
    <div className="h-screen w-full px-8">
      <div className="flex justify-between h-10 w-full items-center">
        <span className="text-2xl font-[600] mt-4">
          {decryptAES(sessionStorage.getItem("u"))}
        </span>
        <span className="flex items-center gap-1">
          <lord-icon
            src="https://cdn.lordicon.com/pdsourfn.json"
            trigger="hover"
            colors="primary:#121331,secondary:#b4b4b4,tertiary:#ebe6ef"
            style={{ transform: "scale(1.4)", marginTop: "2rem" }}
          ></lord-icon>
          <IoSettingsOutline className="animated" size={40} style={{marginTop: "1.9rem"}}/>
        </span>
      </div>
    </div>
  );
};

export default Me;
