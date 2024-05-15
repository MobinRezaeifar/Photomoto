/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import { Avatar, Dropdown } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "antd";
import { deleteStory, fetchStory } from "../../Redux/action";
import VideoSrory from "./VideoSrory";
import { MdArrowForwardIos } from "react-icons/md";
import { GrAdd } from "react-icons/gr";
import { HiMenuAlt3 } from "react-icons/hi";
import { RiDeleteBin2Fill } from "react-icons/ri";

function ShowStoriesModel({
  dimensions,
  show,
  setShow,
  owner,
  change,
  Change,
  mainUser,
}) {
  const Registers = useSelector((state) => state.Registers);
  const Stories = useSelector((state) => state.Stories);
  const carouselRef = useRef(null);
  const [currentSlide, setcurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const [DropDownShow, setDropDownShow] = useState(false);
  const [selectedStoryId, setselectedStoryId] = useState("");

  useEffect(() => {
    dispatch(fetchStory());
  }, []);
  const [MainProfileImg, setMainProfileImg] = useState("");
  useEffect(() => {
    Registers.map((data) => {
      if (data.username == owner) {
        setMainProfileImg(data.profileImg);
      }
    });
  });

  const onChange = (currentSlide) => {
    setcurrentSlide(currentSlide);
    setDropDownShow(false);
  };

  useEffect(() => {
    dispatch(fetchStory());
  }, [change]);

  useEffect(() => {
    let test = [];
    Stories.map((data) => {
      if (data.owner == owner) {
        test.push(data);
      }
    });

    test.map((data, i) => {
      if (currentSlide == i) {
        setselectedStoryId(data._id);
      }
    });
  });

  const DeleteStory = () => {
    dispatch(deleteStory(selectedStoryId));
    Change("change");
    setShow(false);
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          className=" w-[150px] px-2 py-3 rounded-lg"
          style={{ backgroundColor: "#282828" }}
        >
          <ul>
            <li
              onClick={() => DeleteStory()}
              className="text-lg flex items-center gap-2 justify-center"
              id="showSoryDropdown"
              style={{ backgroundColor: "" }}
            >
              <RiDeleteBin2Fill size={22} color="red" />
              Delete Story
            </li>
          </ul>
        </div>
      ),
    },
  ];
  return (
    <div
      className={`relative z-10 ${!show && "hidden"} `}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="CreatePostModel"
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            style={{ backgroundColor: "transparent" }}
            className={`relative  transform overflow-hidden rounded-lg bg-gray-700  text-left transition-all sm:my-8 sm:w-full sm:max-w-[40rem] ${
              dimensions.width < 640 && "mb-40"
            }`}
          >
            <Carousel effect="fade" afterChange={onChange} ref={carouselRef}>
              {(() => {
                return Stories.map((data) => {
                  if (data.owner == owner) {
                    if (data.type == "photo") {
                      return (
                        <div
                          className="w-full h-[50%] flex text-center items-center justify-center "
                          style={{
                            borderRadius: "24px",
                            padding: "40px 0",
                            transform: "scaleX(-1)",
                          }}
                        >
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              filter: data.filter,
                              transform: "scaleX(-1)",
                            }}
                            src={data.media}
                            alt=""
                          />
                        </div>
                      );
                    }
                    if (data.type == "video") {
                      return (
                        <div
                          className="w-full h-[50%] flex text-center items-center justify-center "
                          style={{
                            borderRadius: "24px",
                            padding: "40px 0",
                          }}
                        >
                          <VideoSrory
                            carouselRef={carouselRef}
                            show={show}
                            data={data}
                            currentSlide={currentSlide}
                          />
                        </div>
                      );
                    }
                  }
                });
              })()}
            </Carousel>

            <MdArrowForwardIos
              onClick={() => carouselRef.current.prev()}
              style={{
                transform: "rotate(180deg)",
                cursor: "pointer",
                color: "#393939",
                position: "absolute",
                top: "50%",
                left: "10",
              }}
              size={25}
            />

            <MdArrowForwardIos
              onClick={() => carouselRef.current.next()}
              style={{
                cursor: "pointer",
                color: "#393939",
                position: "absolute",
                top: "50%",
                right: "10",
              }}
              size={25}
            />
            <div
              className="flex items-center justify-between w-full absolute top-0 "
              style={{
                paddingRight: "10px",
                marginTop: "8px",
                paddingLeft: "5px",
              }}
            >
              <div className="flex items-center gap-2">
                <Avatar src={MainProfileImg} size={"large"} />
                <span
                  className="text-xl
                 shadow-2xl
                  text-white"
                  style={{
                    textShadow: "4px 6px 20px rgba(0,0,0,0.7)",
                    fontWeight: "550",
                  }}
                >
                  {owner}
                </span>
              </div>
              <div className="flex items-center gap-2 ">
                <lord-icon
                  src="https://cdn.lordicon.com/snqonmhs.json"
                  trigger="in"
                  colors="primary:#ffffff,secondary:#e83a30"
                  style={{ transform: "scale(1.3)", cursor: "pointer" }}
                  onClick={() => {
                    setShow(false);
                    setDropDownShow(false);
                    carouselRef.current.goTo(0);
                  }}
                />
                {owner == mainUser && (
                  <Dropdown
                    visible={DropDownShow}
                    trigger={["click"]}
                    menu={{
                      items,
                    }}
                    placement="bottom"
                  >
                    <div
                      className="flex items-end justify-start"
                      onClick={() => {
                        setDropDownShow(!DropDownShow);
                      }}
                    >
                      <HiMenuAlt3 size={35} />

                      <GrAdd
                        className="transition-all absolute"
                        size={15}
                        style={{ transform: DropDownShow && "rotate(45deg)" }}
                      />
                    </div>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowStoriesModel;
