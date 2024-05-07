/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { fetchConnection } from "../../Redux/action";
import { connect, useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import SendConnection from "../Connection/SendConnection";
import ReceiverConnection from "../Connection/ReceiverConnection";

const Connection = ({ Change, change }) => {
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
  useEffect(() => {
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
  }, []);

  console.log(RecommendationConnection);

  return (
    <div className="h-full w-full ">
      <div className="overflow-y-auto h-full">
        <div className="w-full flex h-full">
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
          {dimensions.width > 900 && (
            <div className="w-[50%] h-full flex items-center px-10">
              <div className="bg-base-200 w-full h-[50%] overflow-y-auto rounded-3xl p-8">
                {RecommendationConnection.map((data) => {
                  return <h1>{data.username}</h1>;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connection;
