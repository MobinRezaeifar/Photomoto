const initialState = {
  Registers: [],
  Posts: [],
  Issue: "",
  ShowPostModel: false,
  ProfileImg:"https://wallpapercave.com/dwp1x/wp9566386.jpg"
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_REGISTER_SUCCESS":
      return {
        ...state,
        Registers: [...state.Registers, action.payload],
      };

    case "FETCH_REGISTERS_SUCCESS":
      return {
        ...state,
        Registers: action.payload,
      };

    case "UPDATE_REGISTER_SUCCESS":
      return {
        ...state,
        Registers: state.Registers.map((register) =>
          register.id === action.payload.id ? action.payload : register
        ),
      };

    case "DELETE_REGISTER_SUCCESS":
      return {
        ...state,
        Registers: state.Registers.filter(
          (register) => register.id !== action.payload
        ),
      };
    case "ADD_POST_SUCCESS":
      return {
        ...state,
        Posts: [...state.Posts, action.payload],
      };

    case "FETCH_POSTS_SUCCESS":
      return {
        ...state,
        Posts: action.payload,
      };

    case "UPDATE_POST_SUCCESS":
      return {
        ...state,
        Posts: state.Posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };

    case "DELETE_POST_SUCCESS":
      return {
        ...state,
        Posts: state.Posts.filter((post) => post.id !== action.payload),
      };

    case "ISSUE":
      return { ...state, Issue: action.payload };

    case "SHOWPOSTMODEL":
      return { ...state, ShowPostModel: action.payload };
    case "PROFILEIMG":
      return { ...state, ProfileImg: action.payload };

    default:
      return state;
  }
};

export default reducer;
