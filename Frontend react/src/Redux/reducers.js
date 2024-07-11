import { ServerRunning } from "./config";

const initialState = {
  Registers: [],
  Posts: [],
  Messages: [],
  Connections: [],
  Stories: [],
  VideoCallDetails: [],
  Issue: "me",
  ShowPostModel: false,
  ProfileImg: "https://wallpapercave.com/dwp1x/wp9566386.jpg",
  SelectUserChat: "",
  MeBio: "",
  MainUserIdVideoCall: "",
  TargetUserIdVideoCall: "",
  PUMbaseApi: ServerRunning
    ? "https://symmetrical-waffle-9p7jxvp5w5ph7gvg-5295.app.github.dev/"
    : "http://localhost:5295/",
  PPMbaseApi: ServerRunning
    ? "https://symmetrical-waffle-9p7jxvp5w5ph7gvg-5212.app.github.dev/"
    : "http://localhost:5212/",
  PMCbaseApi: ServerRunning
    ? "https://symmetrical-waffle-9p7jxvp5w5ph7gvg-5157.app.github.dev/"
    : "http://localhost:5157/",
  PFMbaseApi: ServerRunning
    ? "https://symmetrical-waffle-9p7jxvp5w5ph7gvg-5226.app.github.dev/"
    : "http://localhost:5226/",
  baseUrlNode: "http://localhost:5001/",
  baseUrlReact: "http://localhost:3000/",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_VIDEOCALLDETAILS_SUCCESS":
      return {
        ...state,
        VideoCallDetails: [...state.VideoCallDetails, action.payload],
      };
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

    case "ADD_MESSAGES_SUCCESS":
      return {
        ...state,
        Messages: [...state.Messages, action.payload],
      };

    case "FETCH_MESSAGES_SUCCESS":
      return {
        ...state,
        Messages: action.payload,
      };

    case "UPDATE_MESSAGES_SUCCESS":
      return {
        ...state,
        Messages: state.Messages.map((Message) =>
          Message.id === action.payload.id ? action.payload : Message
        ),
      };
    case "PATCH_MESSAGES_SUCCESS":
      return {
        ...state,
        Messages: state.Messages.map((Message) =>
          Message.id === action.payload.id ? action.payload : Message
        ),
      };

    case "DELETE_MESSAGES_SUCCESS":
      return {
        ...state,
        Messages: state.Messages.filter(
          (Message) => Message.id !== action.payload
        ),
      };

    case "ADD_CONNECTIONS_SUCCESS":
      return {
        ...state,
        Connections: [...state.Connections, action.payload],
      };

    case "FETCH_CONNECTIONS_SUCCESS":
      return {
        ...state,
        Connections: action.payload,
      };

    case "DELETE_CONNECTIONS_SUCCESS":
      return {
        ...state,
        Connections: state.Connections.filter(
          (Connection) => Connection.id !== action.payload
        ),
      };

    case "FETCH_STORIES_SUCCESS":
      return {
        ...state,
        Stories: action.payload,
      };

    case "ISSUE":
      return { ...state, Issue: action.payload };

    case "SHOWPOSTMODEL":
      return { ...state, ShowPostModel: action.payload };
    case "PROFILEIMG":
      return { ...state, ProfileImg: action.payload };
    case "SELECTUSERCHAT":
      return { ...state, SelectUserChat: action.payload };
    case "MEBIO":
      return { ...state, MeBio: action.payload };
    case "MainUserIdVideoCall":
      return { ...state, MainUserIdVideoCall: action.payload };
    case "TargetUserIdVideoCall":
      return { ...state, TargetUserIdVideoCall: action.payload };
    case "PUMbaseApi":
      return { ...state, PUMbaseApi: action.payload };
    case "PPMbaseApi":
      return { ...state, PPMbaseApi: action.payload };
    case "PMCbaseApi":
      return { ...state, PMCbaseApi: action.payload };
    case "PFMbaseApi":
      return { ...state, PFMbaseApi: action.payload };
    case "BASEURLNODE":
      return { ...state, baseUrlNode: action.payload };
    case "BASEURLREACT":
      return { ...state, baseUrlReact: action.payload };

    default:
      return state;
  }
};

export default reducer;
