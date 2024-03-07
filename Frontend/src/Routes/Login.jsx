import React, { useEffect, useState } from "react";
import usernamePhoto from "../Assets/username.png";
import { useDispatch, useSelector } from "react-redux";
import { RiLockPasswordLine } from "react-icons/ri";
import { fetchRegister } from "../Redux/action";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [ShowLogin, setShowLogin] = useState(false);
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const dispatch = useDispatch();
  const Registers = useSelector((state) => state.Registers);
  let navigate = useNavigate();
  function encryptAES(message) {
    return CryptoJS.AES.encrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  useEffect(() => {
    dispatch(fetchRegister());
  }, [dispatch]);

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

  const LoginUser = () => {
    for (let i = 0; i < Registers.length; i++) {
      const data = Registers[i];
      if (
        data.username === Username &&
        decryptAES(data.password) === Password
      ) {
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
          title: "Successful Login",
        });
        setPassword("");
        setUsername("");
        navigate("/photomoto");
        sessionStorage.setItem("u", encryptAES(data.username));
        sessionStorage.setItem("g", encryptAES(data.gender));
        sessionStorage.setItem("p", encryptAES(data.password));
        sessionStorage.setItem("e", encryptAES(data.email));
        sessionStorage.setItem("f", encryptAES(data.fullName));
        return;
      } else {
        setPassword("");
        setUsername("");
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
          title: "Login faild",
        });
      }
    }
  };

  return (
    <>
      <div
        id="drawer-swipe"
        class={`${
          ShowLogin
            ? "fixed z-40 w-full overflow-y-auto bg-white border-t border-gray-200 rounded-t-lg dark:border-gray-700 dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 transform-none"
            : "fixed z-40 w-full overflow-y-auto bg-white border-t border-gray-200 rounded-t-lg dark:border-gray-700 dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 translate-y-full bottom-[60px]"
        } `}
        tabindex="-1"
        // aria-labelledby="drawer-swipe-label"
        aria-modal="true"
      >
        <div
          class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => setShowLogin(!ShowLogin)}
        >
          <span class="absolute w-8 h-1 -translate-x-1/2 bg-gray-300 rounded-lg top-3 left-1/2 dark:bg-gray-600"></span>
          <h5
            id="drawer-swipe-label"
            class="inline-flex items-center justify-between w-full text-2xl text-gray-500 dark:text-gray-400 font-medium gap-1"
          >
            <div className="flex items-center gap-2">
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/external-aficons-studio-flat-aficons-studio/68/external-login-user-interface-aficons-studio-flat-aficons-studio.png"
                alt="external-login-user-interface-aficons-studio-flat-aficons-studio"
              />
              Login
            </div>
            <div>
              {Password && Username && (
                <lord-icon
                  onClick={LoginUser}
                  src="https://cdn.lordicon.com/dangivhk.json"
                  trigger="hover"
                  colors="primary:#ffffff,secondary:#08a88a"
                  style={{
                    transform: "scale(1.3)",
                    cursor: "pointer",
                    position: "relative",
                    top: "5px",
                    right: "10px",
                  }}
                ></lord-icon>
              )}
            </div>
          </h5>
        </div>

        <div className="flex justify-center p-6 gap-2">
          <form class="flex items-center max-w-lg">
            <div class="relative w-full">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <img
                  width="25"
                  height="25"
                  src={usernamePhoto}
                  alt="external-login-user-interface-aficons-studio-flat-aficons-studio"
                />
              </div>
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={Username}
                type="text"
                id="voice-search"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="username..."
                required
              />
            </div>
          </form>
          <form class="flex items-center max-w-lg">
            <label for="voice-search" class="sr-only">
              Search
            </label>
            <div class="relative w-full">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <RiLockPasswordLine size={25} />
              </div>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={Password}
                type="text"
                id="voice-search"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="password..."
                required
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
