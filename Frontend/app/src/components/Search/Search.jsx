import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../Redux/action";
import { motion } from "framer-motion";
import ShowPostModel from "../Global/ShowPostModel";
const Search = () => {
  const dispatch = useDispatch();
  const Posts = useSelector((state) => state.Posts);
  const [SelectePost, setSelectePost] = useState("");
  useEffect(() => {
    dispatch(fetchPosts());
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
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <div>
      <div
        className="w-full items-center justify-center flex fixed trapezius "
        style={{ marginTop: "-2px" }}
      >
        <div
          className={`w-[90%] md:w-[70%] flex outline-none px-1 py-1 md:text-xl text-md bg-transparent`}
          style={{
            borderBottom: "3px solid gray",
            borderRight: "3px solid gray",
            borderLeft: "3px solid gray",
            borderRadius: "0 0 8px 8px",
            boxShadow: "0px 19px 24px 9px rgba(255,255,255,0.01)",
          }}
        >
          {" "}
          <lord-icon
            src="https://cdn.lordicon.com/anqzffqz.json"
            trigger="hover"
            colors="primary:#121331,secondary:#ebe6ef,tertiary:#545454,quaternary:#b26836"
            style={{ marginLeft: "7px" }}
          ></lord-icon>
          <input
            type="text"
            placeholder="Search..."
            style={{
              backgroundColor: "transparent",
              outline: "none",
              border: "none",
              width: "100%",
              paddingLeft: "10px",
            }}
          />
        </div>
      </div>
      <br />
      <div id="instagram" style={{ padding: "35px 20px" }}>
        <div className="grid  grid-cols-2 sm:grid-cols-4 2xl:grid-cols-6">
          {Posts.map((post, index) => {
            return (
              <div
                onClick={() => {
                  dispatch({
                    type: "SHOWPOSTMODEL",
                    payload: true,
                  });
                  setSelectePost(post.id);
                }}
                className="col-span-1 cursor-pointer"
                key={index}
              >
                <a target="_blank">
                  {post.type.startsWith("video") ? (
                    <motion.video
                      className={`box-${index}`}
                      style={{
                        border: "1px solid #4d4c4c",
                        backgroundSize: "100%",
                      }}
                      src={post.postMedia}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    />
                  ) : (
                    <motion.div
                      className={`box-${index} bg-cover`}
                      style={{
                        backgroundImage: `url(${post.postMedia})`,
                        border: "1px solid #4d4c4c",
                        backgroundPosition: "center",
                        backgroundRepeat: " no-repeat",
                        backgroundSize: "cover",
                      }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    ></motion.div>
                  )}
                </a>
              </div>
            );
          })}
        </div>
      </div>
      <ShowPostModel dimensions={dimensions} Posts={Posts} SelectePost={SelectePost}/>
    </div>
  );
};

export default Search;
