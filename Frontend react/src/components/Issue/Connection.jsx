/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import { AddConnection, fetchConnection } from "../../Redux/action";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import SendConnection from "../Connection/SendConnection";
import ReceiverConnection from "../Connection/ReceiverConnection";
import { Avatar, Dropdown } from "antd";
import moment from "jalali-moment";
import { motion } from "framer-motion";
import { MdRecommend } from "react-icons/md";

const Connection = ({ Change, change }) => {
  const constraintsRef = useRef(null);
  const dispatch = useDispatch();
  const [RecommendationConnection, setRecommendationConnection] = useState([]);
  const Connections = useSelector((state) => state.Connections);
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
  useEffect(() => {
    dispatch(fetchConnection());
  }, []);
  useEffect(() => {
    dispatch(fetchConnection());
  }, [dispatch]);

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

  const FetchRecommendationConnection = () => {
    let test = [];
    Connections.map((Connection) => {
      Registers.map((Register) => {
        if (
          Connection.relation ==
            Register.username + "," + decryptAES(sessionStorage.getItem("u")) ||
          Connection.relation ==
            decryptAES(sessionStorage.getItem("u")) + "," + Register.username
        ) {
          test.push(Register.username);
        }
      });
    });
    Registers.map((x) => {
      if (!test.includes(x.username)) {
        if (x.username != decryptAES(sessionStorage.getItem("u"))) {
          if (!RecommendationConnection.includes(x)) {
            RecommendationConnection.push(x);
          }
        }
      }
    });
  };

  useEffect(() => {
    FetchRecommendationConnection();
  }, [dispatch]);
  useEffect(() => {
    FetchRecommendationConnection();
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className=" h-full flex items-center "
        >
          <div className="bg-base-200 h-[160px] overflow-y-auto w-full  rounded-3xl p-2 flex flex-col gap-2">
            {RecommendationConnection.map((data) => {
              const now = Date.now();
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full px-4 py-2 rounded-lg flex justify-between"
                >
                  <div className="flex items-center gap-2 mr-2">
                    <Avatar size={36} src={data.profileImg} />
                    <span className="font-bold text-xl">{data.username}</span>
                  </div>{" "}
                  <button
                    onClick={async () => {
                      await dispatch(
                        AddConnection({
                          id: now + "",
                          status: "send",
                          sender: decryptAES(sessionStorage.getItem("u")),
                          receiver: data.username,
                          relation:
                            decryptAES(sessionStorage.getItem("u")) +
                            "," +
                            data.username,
                          time: moment(now).format("jYYYY-jMM-jDD HH:mm:ss"),
                        })
                      );
                      await dispatch(fetchConnection());
                      const updatedObjects = RecommendationConnection.filter(
                        (obj) => obj.id !== data.id
                      );
                      setRecommendationConnection(updatedObjects);
                    }}
                    className="btn glass bg-blue-700 text-white"
                    style={{ transform: "scale(0.9)" }}
                  >
                    Connection
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="overflow-y-auto h-full">
        <div className="w-full flex h-full " ref={constraintsRef}>
          <div
            className={` ${
              dimensions.width > 900 ? "w-[50%]" : "w-[100%]"
            } px-4`}
          >
            {(() => {
              const sortedConnections = Connections.sort(
                (a, b) => new Date(b.time) - new Date(a.time)
              );

              return sortedConnections.map((data) => {
                if (
                  data.sender === decryptAES(sessionStorage.getItem("u")) ||
                  data.receiver === decryptAES(sessionStorage.getItem("u"))
                ) {
                  if (data.sender === decryptAES(sessionStorage.getItem("u"))) {
                    return (
                      <SendConnection
                        key={data.time}
                        sender={data.sender}
                        receiver={data.receiver}
                        status={data.status}
                        Connections={Connections}
                      />
                    );
                  }
                  if (
                    data.receiver === decryptAES(sessionStorage.getItem("u"))
                  ) {
                    return (
                      <ReceiverConnection
                        key={data.time}
                        sender={data.sender}
                        receiver={data.receiver}
                        status={data.status}
                        Connections={Connections}
                        Change={Change}
                        change={change}
                        dataId={data.id}
                      />
                    );
                  }
                }
                return null;
              });
            })()}
          </div>
          {dimensions.width > 900 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-[50%] h-full flex items-center px-10"
            >
              <div className="bg-base-200 w-full h-[50%] overflow-y-auto rounded-3xl p-4   flex flex-col gap-2">
                <h1 className="mb-2 font-bold text-xl flex gap-2 justify-center items-center">
                  {" "}
                  <MdRecommend
                    size={26}
                    style={{
                      boxShadow:
                        "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
                      borderRadius: "50%",
                    }}
                  />
                  Recommendation
                </h1>
                {RecommendationConnection.map((data) => {
                  const now = Date.now();
                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full bg-slate-600 px-4 py-2 rounded-lg flex justify-between"
                    >
                      <div className="flex items-center gap-1">
                        <Avatar size={36} src={data.profileImg} />
                        <span className="font-bold text-xl">
                          {data.username}
                        </span>
                      </div>{" "}
                      <button
                        onClick={async () => {
                          await dispatch(
                            AddConnection({
                              id: now + "",
                              status: "send",
                              sender: decryptAES(sessionStorage.getItem("u")),
                              receiver: data.username,
                              relation:
                                decryptAES(sessionStorage.getItem("u")) +
                                "," +
                                data.username,
                              time: moment(now).format(
                                "jYYYY-jMM-jDD HH:mm:ss"
                              ),
                            })
                          );
                          await dispatch(fetchConnection());
                          const updatedObjects =
                            RecommendationConnection.filter(
                              (obj) => obj.id !== data.id
                            );
                          setRecommendationConnection(updatedObjects);
                        }}
                        className="btn glass bg-blue-700 text-white"
                        style={{ transform: "scale(0.9)" }}
                      >
                        Connection
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              drag
              dragConstraints={constraintsRef}
              className="fixed  "
            >
              <Dropdown menu={{ items }} placement="bottom" trigger={["click"]}>
                <MdRecommend
                  size={40}
                  style={{
                    boxShadow:
                      "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
                    borderRadius: "50%",
                  }}
                />
              </Dropdown>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connection;
