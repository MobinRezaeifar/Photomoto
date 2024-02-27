const initialState = {
  Registers: [],
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

    default:
      return state;
  }
};

export default reducer;
