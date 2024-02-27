import React, { useEffect, useState } from "react";
import photo1 from "../Assets/Photo1.png";
import "./Register.css";
import { MdCamera } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AddRegister, fetchRegister } from "../Redux/action";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";

const Register = () => {
  const dispatch = useDispatch();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [Role, setRole] = useState("");


  const key = CryptoJS.enc.Utf8.parse("1234567890123456");
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); 
  function encryptAES(message) {
    return CryptoJS.AES.encrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }


  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateSize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);
  
  useEffect(() => {
    dispatch(fetchRegister());
  }, [dispatch]);

  const submitRegister = async () => {
    if (Username && Password && Email && Role) {
      sessionStorage.setItem("u", encryptAES(Username));
      sessionStorage.setItem("r", encryptAES(Role));
      sessionStorage.setItem("p", encryptAES(Password));
      sessionStorage.setItem("e", encryptAES(Email));

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Successful registration",
      });
      await dispatch(
        AddRegister({
          username: Username,
          password: encryptAES(Password),
          profileImg: "",
          email: Email,
          role: Role,
          hash: "",
        })
      );
      await setEmail("");
      await setPassword("");
      await setRole("");
      await setUsername("");
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Complete The Information",
      });
    }
  };


  function decryptAES(message) {
    const bytes = CryptoJS.AES.decrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  }


  return (
    <div className="h-screen w-screen px-20 flex justify-center items-center">
      <div
        className="flex items-center justify-center"
        style={{ transform: "scale(1.1)" }}
      >
        {dimensions.width > 900 && (
          <div className="w-[50%] flex justify-center">
            <img
              src={photo1}
              style={{
                height: "450px",
                width: "100%",
                borderRadius: "20px 0 0 0",
              }}
              alt=""
            />
          </div>
        )}
        <div className={` ${dimensions.width > 900 ? "w-[50%]" : "w-[100%]"} `}>
          <div
            className="form-container"
            style={{ height: dimensions.width > 900 ? "450px" : "500px" }}
          >
            <div className="form  h-full">
              <div style={{ height: dimensions.width > 900 ? "53%" : "60%" }}>
                <span
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <MdCamera />
                  Photomoto
                </span>
                <div
                  className={`${dimensions.width > 900 && "flex"} gap-2`}
                  style={{ marginTop: "30px" }}
                >
                  <input
                    placeholder="Username..."
                    type="text"
                    className="input"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    placeholder="Password..."
                    id="password"
                    type="password"
                    className="input"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <input
                  placeholder="Email..."
                  id="mail"
                  type="email"
                  className="input"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div
                className={`flex  px-2 text-gray-500 ${
                  dimensions.width > 900
                    ? "mb-4 justify-between"
                    : "mb-2 mt-1 justify-around"
                } `}
              >
                <a href="/login">Login</a>
                <a href="/login">I have an account</a>
              </div>

              <ul
                class={` w-full gap-6  mb-4 grid-cols-2 ${
                  dimensions.width > 900
                    ? "grid grid-cols-2"
                    : "flex justify-around"
                }`}
              >
                <li onClick={() => setRole("client")}>
                  <input
                    type="radio"
                    id="hosting-small"
                    name="hosting"
                    value="hosting-small"
                    class="hidden peer"
                    required
                  />
                  <label
                    style={{ backgroundColor: "#002733" }}
                    for="hosting-small"
                    class={`inline-flex items-center ${
                      dimensions.width > 900
                        ? "justify-between w-full"
                        : "justify-center "
                    } p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
                  >
                    {dimensions.width > 900 && (
                      <div class="block">
                        <div class="w-full text-lg font-semibold">Client</div>
                      </div>
                    )}

                    <lord-icon
                      src="https://cdn.lordicon.com/piolrlvu.json"
                      trigger="hover"
                      style={{ transform: "scale(1.7)" }}
                    ></lord-icon>
                  </label>
                </li>
                <li onClick={() => setRole("photographer")}>
                  <input
                    type="radio"
                    id="hosting-big"
                    name="hosting"
                    value="hosting-big"
                    class="hidden peer"
                  />
                  <label
                    style={{ backgroundColor: "#002733" }}
                    for="hosting-big"
                    class={`inline-flex items-center ${
                      dimensions.width > 900
                        ? "justify-between w-full"
                        : "justify-center "
                    }   p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
                  >
                    {dimensions.width > 900 && (
                      <div class="block">
                        <div class="w-full text-lg font-semibold">
                          Photographer
                        </div>
                      </div>
                    )}

                    <lord-icon
                      src="https://cdn.lordicon.com/bmlkvhui.json"
                      trigger="hover"
                      style={{ transform: "scale(1.7)" }}
                    ></lord-icon>
                  </label>
                </li>
              </ul>

              <div className="button-container">
                <div
                  className="reset-button-container"
                  onClick={submitRegister}
                >
                  <div id="reset-btn" className="reset-button">
                    Submit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
