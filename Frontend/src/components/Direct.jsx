import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";

const Direct = () => {
  const Registers = useSelector((state) => state.Registers);

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
    <div className="flex items-center justify-center h-full w-full">
      <div className=" w-[20%] h-full bg-[#37415171]">
        <div className="flex items-center w-full p-6 gap-1 h-[8%]">
          <lord-icon
            src="https://cdn.lordicon.com/wwpzpqta.json"
            trigger="hover"
            style={{ transform: "scale(1.2)" }}
          ></lord-icon>
          <h1 className="text-2xl font-bold">Direct</h1>
        </div>
        <div className="h-[92%] overflow-y-auto flex flex-col">
          {Registers.map(
            (data) =>
              data.username == decryptAES(sessionStorage.getItem("u")) &&
              data.connection.map((connect) => (
                <div className="w-full my-[0.3rem] px-3">
                  <div
                    className="w-full hover:bg-base-100"
                    id="directItem"
                    style={{
                      borderRadius: "8px",
                      fontSize: "20px",
                      padding: "7px 20px",
                      border: "1px solid gray",
                      cursor: "pointer",
                    }}
                  >
                    {connect.username}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
      <div
        className=" w-[80%] h-full
    bg-base-100
       "
      >
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero hic
        consectetur assumenda accusamus, explicabo minus architecto distinctio
        nisi similique laboriosam! Qui, unde vitae. Autem quam libero, optio
        placeat reprehenderit veritatis?
      </div>
    </div>
  );
};

export default Direct;
