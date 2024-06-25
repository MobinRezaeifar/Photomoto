/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import photo1 from "../Assets/Photo1.png";
import "./Register.css";
import { MdCamera } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister } from "../Redux/action";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "../components/Global/Login";
import { browserName } from "react-device-detect";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Cookies from "js-cookie";

const Register = () => {
  const PUMbaseApi = useSelector((state) => state.PUMbaseApi);
  const dispatch = useDispatch();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [Gender, setGender] = useState("");
  const [FullName, setFullName] = useState("");
  const [ShowPassword, setShowPassword] = useState("");
  let navigate = useNavigate();
  const [ShowLogin, setShowLogin] = useState(false);

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
      if (window) {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

  useEffect(() => {
    dispatch(fetchRegister());
  }, [dispatch]);

  const submitRegister = async () => {
    axios
      .post(`${PUMbaseApi}Register/v1/api/CreateRegister`, {
        username: Username,
        password: Password,
        fullName: FullName,
        profileImg: "https://wallpapercave.com/dwp1x/wp9566386.jpg",
        email: Email,
        gender: Gender,
        bio: `Hello, Im ${FullName} and I just became a member of Photomoto platform`,
      })
      .then(
        (x) => {
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
            title: "Successful Registration",
          });
          setEmail("");
          setPassword("");
          setGender("");
          setUsername("");
          setFullName("");
          navigate("/photomoto");
          Cookies.set("jwt", x.data.token, { expires: 36500 });
          Cookies.set("u", Username, { expires: 36500 });
        },
        (error) => {
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
            title: error.response.data,
          });
        }
      );
  };

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
            style={{ height: dimensions.width > 900 ? "450px" : "530px" }}
          >
            <div className="form  h-full">
              <div style={{ height: dimensions.width > 900 ? "53%" : "67%" }}>
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
                    tabIndex={1}
                    placeholder="Username..."
                    type="text"
                    className="input"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {(() => {
                    if (browserName == "Edge") {
                      return (
                        <input
                          tabIndex={!ShowLogin ? 2 : -1}
                          placeholder="Password..."
                          id="password"
                          type="password"
                          className="input"
                          value={Password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      );
                    } else {
                      return (
                        <span className="flex items-center justify-end w-[100%]">
                          {ShowPassword ? (
                            <input
                              tabIndex={!ShowLogin ? 2 : -1}
                              placeholder="Password..."
                              id="password"
                              type="text"
                              className="input"
                              value={Password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          ) : (
                            <input
                              tabIndex={!ShowLogin ? 2 : -1}
                              placeholder="Password..."
                              id="password"
                              type="password"
                              className="input"
                              value={Password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          )}

                          {ShowPassword ? (
                            <HiEye
                              style={{
                                position: "absolute",
                                marginBottom: "20px",
                                marginRight: "10px",
                              }}
                              size={25}
                              onClick={() => setShowPassword(false)}
                            />
                          ) : (
                            <HiEyeOff
                              style={{
                                position: "absolute",
                                marginBottom: "20px",
                                marginRight: "10px",
                              }}
                              size={25}
                              onClick={() => setShowPassword(true)}
                            />
                          )}
                        </span>
                      );
                    }
                  })()}
                </div>
                <div className={`${dimensions.width > 900 && "flex"} gap-2`}>
                  <input
                    tabIndex={!ShowLogin ? 3 : -1}
                    placeholder="Fullname..."
                    id="fullname"
                    type="text"
                    className="input"
                    value={FullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <input
                    tabIndex={4}
                    placeholder="Email..."
                    id="mail"
                    type="email"
                    className="input"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div
                className={`flex  px-2 text-gray-500 ${
                  dimensions.width > 900
                    ? "mb-7 justify-between"
                    : "mb-2 mt-1 justify-around"
                } `}
              >
                <a
                  onClick={() => {
                    setShowLogin(true);
                  }}
                >
                  Login
                </a>
                <a
                  onClick={() => {
                    setShowLogin(true);
                  }}
                >
                  I have an account
                </a>
              </div>

              <ul
                class={` w-full gap-6   grid-cols-3 ${
                  dimensions.width > 900
                    ? "grid grid-cols-2"
                    : "mt-6 flex justify-around"
                }`}
              >
                <li tabIndex={5} onClick={() => setGender("male")}>
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
                        <div class="w-full text-lg font-semibold">Male</div>
                      </div>
                    )}

                    <lord-icon
                      src="https://cdn.lordicon.com/mebvgwrs.json"
                      trigger="hover"
                      style={{ transform: "scale(1.3)" }}
                    ></lord-icon>
                  </label>
                </li>
                <li tabIndex={6} onClick={() => setGender("female")}>
                  <input
                    type="radio"
                    id="hosting-smalll"
                    name="hosting"
                    value="hosting-smalll"
                    class="hidden peer"
                    required
                  />
                  <label
                    style={{ backgroundColor: "#002733" }}
                    for="hosting-smalll"
                    class={`inline-flex items-center ${
                      dimensions.width > 900
                        ? "justify-between w-full"
                        : "justify-center "
                    } p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
                  >
                    {dimensions.width > 900 && (
                      <div class="block mr-2">
                        <div class="w-full text-lg font-semibold">Female</div>
                      </div>
                    )}

                    <lord-icon
                      src="https://cdn.lordicon.com/pyarizrk.json"
                      trigger="hover"
                      style={{
                        transform:
                          dimensions.width > 900 ? "scale(2.5)" : "scale(1.3)",
                      }}
                    ></lord-icon>
                  </label>
                </li>
                <li onClick={() => setGender("other")} tabIndex={7}>
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
                        <div class="w-full text-lg font-semibold">Other</div>
                      </div>
                    )}

                    <lord-icon
                      src="https://cdn.lordicon.com/fmasbomy.json"
                      trigger="hover"
                      style={{ transform: "scale(1.1)" }}
                    ></lord-icon>
                  </label>
                </li>
              </ul>

              <div className="button-container cursor-pointer">
                <div
                  tabIndex={8}
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
      <Login ShowLogin={ShowLogin} setShowLogin={setShowLogin} />
    </div>
  );
};

export default Register;
