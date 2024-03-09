import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../Redux/action";
import ShowPostModel from "./ShowPostModel";

const Posts = ({ mainUser, dimensions, ProfileImg }) => {
  const dispatch = useDispatch();
  const [showPostModel, setShowPostModel] = useState(false);
  const Posts = useSelector((state) => state.Posts);
  const [SelectePost, setSelectePost] = useState({});
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="container">
      <div id="instagram">
        <div className="grid  grid-cols-2 sm:grid-cols-4 2xl:grid-cols-6">
          {Posts.map((post, index) => {
            if (post.owner == mainUser) {
              return (
                <div
                  className="col-span-1 cursor-pointer"
                  key={index}
                  onClick={() => {
                    setShowPostModel(true);
                    setSelectePost(post);
                  }}
                >
                  <a target="_blank">
                    {post.type.startsWith("video") ? (
                      <video
                        className={`box-${index}`}
                        style={{
                          border: "1px solid #4d4c4c",
                          backgroundSize: "100%",
                        }}
                        src={post.postMedia}
                      />
                    ) : (
                      <div
                        className={`box-${index} bg-cover`}
                        style={{
                          backgroundImage: `url(${post.postMedia})`,
                          border: "1px solid #4d4c4c",
                          backgroundPosition: "center",
                          backgroundRepeat: " no-repeat",
                          backgroundSize: "cover",
                        }}
                      ></div>
                    )}
                  </a>
                </div>
              );
            }
          })}
        </div>
      </div>
      <ShowPostModel
        ProfileImg={ProfileImg}
        showPostModel={showPostModel}
        setShowPostModel={setShowPostModel}
        SelectePost={SelectePost}
        dimensions={dimensions}
        Posts={Posts}
        
      />
    </div>
  );
};

export default Posts;
