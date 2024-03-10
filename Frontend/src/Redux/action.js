let RegisterApi = "http://localhost:5221/api/Registers";
let PostApi = "http://localhost:5221/api/Posts";

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
