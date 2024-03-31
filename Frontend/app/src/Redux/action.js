import axios from "axios";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let RegisterApi = "http://localhost:5221/api/Registers";
let PostApi = "http://localhost:5221/api/Posts";
let MessagesApi = "http://localhost:5221/api/Messages";

const change = [];

const Change = async (change) => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(`http://localhost:5221/change`)
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

export const deleteMessagesSuccess = (id) => ({
  type: "DELETE_MESSAGES_SUCCESS",
  payload: id,
});

export const DownloadMedia = (src) => {
  return async (dispatch) => {
    try {
      axios({
        url: `http://localhost:5221/api/FileManager/downloadfile?FileName=${src}`,
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

export const AddRegister = (newUser) => {
  return async (dispatch) => {
    try {
      const response = await fetch(RegisterApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const register = await response.json();
      dispatch(addRegiaterSuccess(register));
    } catch (error) {
      console.error("Error adding register:", error);
    }
  };
};

export const fetchRegister = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(RegisterApi);
      const register = await response.json();
      dispatch(fetchRegistersSuccess(register));
    } catch (error) {
      console.error("Error fetching register:", error);
    }
  };
};

export const updateRegister = (id, updatedRegister) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${RegisterApi}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRegister),
      });

      const register = await response.json();
      dispatch(updateRegisterSuccess(register));
    } catch (error) {
      console.error(`Error updating register with ID ${id}:`, error);
    }
  };
};

export const deleteRegister = (id) => {
  return async (dispatch) => {
    try {
      await fetch(`${RegisterApi}/${id}`, {
        method: "DELETE",
      });

      dispatch(deleteRegisterSuccess(id));
    } catch (error) {
      console.error(`Error deleting register with ID ${id}:`, error);
    }
  };
};

export const AddPost = (newPost) => {
  return async (dispatch) => {
    try {
      const response = await fetch(PostApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      const post = await response.json();
      dispatch(addPostSuccess(post));
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };
};

export const fetchPosts = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(PostApi);
      const post = await response.json();
      dispatch(fetchPostsSuccess(post));
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };
};

export const updatePost = (id, updatePost) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${PostApi}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePost),
      });

      const post = await response.json();
      dispatch(updatePostsSuccess(post));
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
    }
  };
};

export const deletePost = (id) => {
  return async (dispatch) => {
    try {
      await fetch(`${PostApi}/${id}`, {
        method: "DELETE",
      });

      dispatch(deletePostSuccess(id));
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
    }
  };
};

export const AddMessages = (message) => {
  return async (dispatch) => {
    try {
      const response = await fetch(MessagesApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const messages = await response.json();
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

export const fetchMessages = (token) => {
  return async (dispatch) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.get(MessagesApi, { headers });
      dispatch(fetchMessagesSuccess(response.data));
    } catch (error) {
      console.error("Error:", error);
    }
  };
};

export const updateMessages = (id, message) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${MessagesApi}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const messages = await response.json();
      dispatch(updateMessagesSuccess(messages));
    } catch (error) {
      console.error(`Error updating message with ID ${id}:`, error);
    }
  };
};

export const deleteMessages = (id) => {
  return async (dispatch) => {
    try {
      await fetch(`${MessagesApi}/${id}`, {
        method: "DELETE",
      });

      dispatch(deleteMessagesSuccess(id));
      await Change("change");
    } catch (error) {
      console.error(`Error deleting message with ID ${id}:`, error);
    }
  };
};
