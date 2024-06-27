import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../Redux/action";
import ShowPostModel from "./ShowPostModel";
import { motion } from "framer-motion";
const Postss = ({ dimensions, User, Change, change, headers, Posts }) => {
  const PFMbaseApi = useSelector((state) => state.PFMbaseApi);
  const dispatch = useDispatch();
  const [SelectePost, setSelectePost] = useState({});
  const [showPostModel, setshowPostModel] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

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
                  setSelectePost(post);
                  setshowPostModel(true);
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
                      src={`${PFMbaseApi}api/FileManager/downloadfile?FileName=${post.postMedia}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    />
                  ) : (
                    <motion.div
                      className={`box-${index} bg-cover`}
                      style={{
                        backgroundImage: `url(${PFMbaseApi}api/FileManager/downloadfile?FileName=${post.postMedia})`,
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
        showPostModel={showPostModel}
        setshowPostModel={setshowPostModel}
        User={User}
        SelectePost={SelectePost}
        dimensions={dimensions}
        Change={Change}
        change={change}
        headers={headers}
      />
    </div>
  );
};

export default Postss;
