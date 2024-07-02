import axios from "axios";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Cookies from "js-cookie";
import { ServerRunning } from "./config";
let PUMbaseApi = ServerRunning
  ? "https://symmetrical-waffle-9p7jxvp5w5ph7gvg-5295.app.github.dev/"
  : "http://localhost:5295/";
let PPMbaseApi = ServerRunning
  ? "https://symmetrical-waffle-9p7jxvp5w5ph7gvg-5212.app.github.dev/"
  : "http://localhost:5212/";
let PMCbaseApi = ServerRunning
  ? "https://symmetrical-waffle-9p7jxvp5w5ph7gvg-5157.app.github.dev/"
  : "http://localhost:5157/";
let PFMbaseApi = ServerRunning
  ? "https://symmetrical-waffle-9p7jxvp5w5ph7gvg-5226.app.github.dev/"
  : "http://localhost:5226/";
let StoryApi = "http://localhost:5001/api/story";

const Change = async (change) => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(`${PMCbaseApi}change`)
      .configureLogging(LogLevel.Information)
      .build();
    await connection.start();

    connection.invoke("Connect", change).catch((err) => console.error(err));

    connection.on("getChange", (chang) => {
      chang.push(chang);
    });
  } catch (e) {
    console.log(e);
  }
};

export const fetchvideoCallDetailsSuccess = (videoCallDetails) => ({
  type: "FETCH_VIDEOCALLDETAILS_SUCCESS",
  payload: videoCallDetails,
});

export const addRegiaterSuccess = (user) => ({
  type: "ADD_REGISTER_SUCCESS",
  payload: user,
});

export const fetchRegistersSuccess = (users) => ({
  type: "FETCH_REGISTERS_SUCCESS",
  payload: users,
});

export const updateRegisterSuccess = (updatedUser) => ({
  type: "UPDATE_REGISTER_SUCCESS",
  payload: updatedUser,
});

export const deleteRegisterSuccess = (id) => ({
  type: "DELETE_REGISTER_SUCCESS",
  payload: id,
});

export const addPostSuccess = (post) => ({
  type: "ADD_POST_SUCCESS",
  payload: post,
});

export const fetchPostsSuccess = (posts) => ({
  type: "FETCH_POSTS_SUCCESS",
  payload: posts,
});

export const updatePostsSuccess = (updatePost) => ({
  type: "UPDATE_POST_SUCCESS",
  payload: updatePost,
});

export const deletePostSuccess = (id) => ({
  type: "DELETE_POST_SUCCESS",
  payload: id,
});

export const addMessagesSuccess = (messages) => ({
  type: "ADD_MESSAGES_SUCCESS",
  payload: messages,
});

export const fetchMessagesSuccess = (messages) => ({
  type: "FETCH_MESSAGES_SUCCESS",
  payload: messages,
});

export const updateMessagesSuccess = (messages) => ({
  type: "UPDATE_MESSAGES_SUCCESS",
  payload: messages,
});
export const PatchMessagesSuccess = (messages) => ({
  type: "PATCH_MESSAGES_SUCCESS",
  payload: messages,
});

export const deleteMessagesSuccess = (id) => ({
  type: "DELETE_MESSAGES_SUCCESS",
  payload: id,
});

export const addConnectionSuccess = (connect) => ({
  type: "ADD_CONNECTIONS_SUCCESS",
  payload: connect,
});

export const fetchConnectionSuccess = (connect) => ({
  type: "FETCH_CONNECTIONS_SUCCESS",
  payload: connect,
});

export const deleteConnectionSuccess = (id) => ({
  type: "DELETE_CONNECTIONS_SUCCESS",
  payload: id,
});
export const updateConnectionSuccess = (connect) => ({
  type: "UPDATE_CONNECTIONS_SUCCESS",
  payload: connect,
});

export const fetchStorySuccess = (story) => ({
  type: "FETCH_STORIES_SUCCESS",
  payload: story,
});
export const addStorySuccess = (story) => ({
  type: "ADD_STORY_SUCCESS",
  payload: story,
});
export const deleteStorySuccess = (id) => ({
  type: "DELETE_STORY_SUCCESS",
  payload: id,
});

export const fetchVideoCallDetails = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`v1/videoCallDetails`);
      const videoCallDetail = await response.json();
      dispatch(fetchvideoCallDetailsSuccess(videoCallDetail));
    } catch (error) {
      console.error("Error fetching videoCallDetail:", error);
    }
  };
};

export const DownloadMedia = (src) => {
  return async (dispatch) => {
    try {
      axios({
        url: `${PFMbaseApi}api/FileManager/downloadfile?FileName=${src}`,
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", src);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error("Error adding register:", error);
    }
  };
};

export const addRegister = (newUser) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `${PUMbaseApi}Register/v1/api/CreateRegister`,
        newUser,
        { headers }
      );

      const register = response.data;
      dispatch(addRegiaterSuccess(register));
    } catch (error) {
      console.error("Error adding register:", error);
    }
  };
};

export const fetchRegister = () => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.get(`${PUMbaseApi}Register/v1/api/GetAll`, {
        headers,
      });
      dispatch(fetchRegistersSuccess(response.data));
    } catch (error) {
      console.error("Error fetching register:", error);
    }
  };
};

export const updateRegister = (id, updatedRegister) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.patch(
        `${PUMbaseApi}Register/v1/api/UpdateRegisterById?id=${id}`,
        updatedRegister,
        { headers }
      );

      const register = response.data;
      dispatch(updateRegisterSuccess(register));
    } catch (error) {
      console.error(`Error updating register with ID ${id}:`, error);
    }
  };
};

export const deleteRegister = (id) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
    };

    try {
      await axios.delete(
        `${PUMbaseApi}Register/v1/api/DeleteRegister?id=${id}`,
        { headers }
      );

      dispatch(deleteRegisterSuccess(id));
    } catch (error) {
      console.error(`Error deleting register with ID ${id}:`, error);
    }
  };
};
export const AddPost = (newPost) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `${PPMbaseApi}Post/v1/api/CreatePost`,
        newPost,
        { headers }
      );

      const post = response.data;
      dispatch(addPostSuccess(post));
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };
};

export const fetchPosts = () => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.get(`${PPMbaseApi}Post/v1/api/GetAll`, {
        headers,
      });
      dispatch(fetchPostsSuccess(response.data));
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };
};

export const updatePost = (id, updatePost) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.patch(
        `${PPMbaseApi}Post/v1/api/UpdatePost?id=${id}`,
        updatePost,
        { headers }
      );

      const post = response.data;
      dispatch(updatePostsSuccess(post));
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
    }
  };
};

export const deletePost = (id) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };

    try {
      await axios.delete(`${PPMbaseApi}Post/v1/api/DeletePost?id=${id}`, {
        headers,
      });

      dispatch(deletePostSuccess(id));
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
    }
  };
};

export const AddMessages = (message) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `${PMCbaseApi}Message/v1/api/CreateMessage`,
        message,
        { headers }
      );

      const messages = response.data;
      dispatch(addMessagesSuccess(messages));
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };
};

// export const fetchMessages = () => {
//   return async (dispatch) => {
//     try {
//       const response = await fetch(MessagesApi);
//       const message = await response.json();
//       dispatch(fetchMessagesSuccess(message));
//     } catch (error) {
//       console.error("Error fetching message:", error);
//     }
//   };
// };

export const fetchMessages = () => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.get(`${PMCbaseApi}Message/v1/api/GetAll`, {
        headers,
      });
      dispatch(fetchMessagesSuccess(response.data));
    } catch (error) {
      console.error("Error:", error);
    }
  };
};

export const patchMessages = (id, message) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.patch(
        `${PMCbaseApi}Message/v1/api/UpdateMessage?id=${id}`,
        message,
        { headers }
      );

      dispatch(PatchMessagesSuccess(response.data));
      await Change("change");
    } catch (error) {
      console.error(`Error updating message with ID ${id}:`, error);
    }
  };
};

export const deleteMessages = (id) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };
    try {
      await axios.delete(`${PMCbaseApi}Message/v1/api/DeleteMessage?id=${id}`, {
        headers,
      });

      dispatch(deleteMessagesSuccess(id));
      await Change("change");
    } catch (error) {
      console.error(`Error deleting message with ID ${id}:`, error);
    }
  };
};

export const AddConnection = (connection) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `${PUMbaseApi}Connection/v1/api/CreateConnection`,
        connection,
        { headers }
      );

      await Change("change");

      const connections = response.data;
      dispatch(addConnectionSuccess(connections));
    } catch (error) {
      console.error("Error adding connection:", error);
    }
  };
};

export const fetchConnection = () => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.get(
        `${PUMbaseApi}Connection/v1/api/GetAll`,
        { headers }
      );
      dispatch(fetchConnectionSuccess(response.data));
    } catch (error) {
      console.error("Error fetching connection:", error);
    }
  };
};

export const deleteConnection = (id) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };
    try {
      await axios.delete(
        `${PUMbaseApi}Connection/v1/api/DeleteConnection?id=${id}`,
        { headers }
      );

      dispatch(deleteConnectionSuccess(id));
      await Change("change");
    } catch (error) {
      console.error(`Error deleting connection with ID ${id}:`, error);
    }
  };
};

export const UpdateConnection = (id, update) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.patch(
        `${PUMbaseApi}Connection/v1/api/UpdateConnection?id=${id}`,
        update,
        { headers }
      );

      dispatch(updateConnectionSuccess(response.data));
    } catch (error) {
      console.error(`Error updating connection with ID ${id}:`, error);
    }
  };
};

export const fetchStory = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(StoryApi + "/get");
      const story = await response.json();
      dispatch(fetchStorySuccess(story));
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };
};

export const deleteStory = (id) => {
  return async (dispatch) => {
    try {
      await fetch(`${StoryApi}/delete/${id}`, {
        method: "DELETE",
      });

      dispatch(deleteStorySuccess(id));
      await Change("change");
    } catch (error) {
      console.error(`Error deleting register with ID ${id}:`, error);
    }
  };
};

export const AddStory = (newStory) => {
  return async (dispatch) => {
    try {
      const response = await fetch(StoryApi + "/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStory),
      });

      const story = await response.json();
      dispatch(addStorySuccess(story));
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };
};
