import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../Redux/action";
import ShowPostModel from "./ShowPostModel";
import { motion } from "framer-motion";
import axios from "axios";
const Postss = ({ mainUser, dimensions, ProfileImg, Change, change }) => {
  const dispatch = useDispatch();
  const [Posts, setPosts] = useState([]);
  const [SelectePost, setSelectePost] = useState({});
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);
  const baseUrlDotenet = useSelector((state) => state.baseUrlDotenet);

  useEffect(() => {
    axios
      .get(`${baseUrlDotenet}api/Posts/searchByOwner?owner=${mainUser}`)
      .then((response) => {
        if (response.status !== 404) {
          setPosts(response.data);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn("No posts found for this tag.");
          setPosts([]);
        } else {
          console.error(error);
        }
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${baseUrlDotenet}api/Posts/searchByOwner?owner=${mainUser}`)
      .then((response) => {
        if (response.status !== 404) {
          setPosts(response.data);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.warn("No posts found for this tag.");
          setPosts([]);
        } else {
          console.error(error);
        }
      });
  }, [change]);

  return (
    <div className="container">
      <div id="instagram">
        <div className="grid  grid-cols-2 sm:grid-cols-4 2xl:grid-cols-6">
          {Posts.map((post, index) => {
            return (
              <div
                className="col-span-1 cursor-pointer"
                key={index}
                onClick={() => {
                  dispatch({
                    type: "SHOWPOSTMODEL",
                    payload: true,
                  });
                  setSelectePost(post.id);
                }}
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
      <ShowPostModel
        ProfileImg={ProfileImg}
        SelectePost={SelectePost}
        dimensions={dimensions}
        Posts={Posts}
        Change={Change}
        change={change}
      />
    </div>
  );
};

export default Postss;
