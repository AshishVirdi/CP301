import { LOGIN, LOGOUT } from "../constants";

export const userReducer = (state, action) => {
  switch (action.type) {
    case LOGIN.RESET: {
      return {
        ...state,
        pending: false,
        error: false,
        success: false,
        message: "",
      };
    }
    case LOGIN.PENDING: {
      return {
        ...state,
        pending: false,
        loggedin: true,
      };
    }
    case LOGIN.SUCCESS: {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        pending: false,
        loggedin: true,
        user: action.payload,
        error: false,
        message: "",
      };
    }
    case LOGIN.ERROR: {
      return {
        ...state,
        pending: false,
        error: true,
        message: action.payload,
      };
    }
    case LOGOUT: {
      localStorage.removeItem("user");
      return {
        ...state,
        loggedin:false,
        user:null,
        pending: false,
        error: false,
        success: false,
        message: "",
      }
    }
    default: {
      return state;
    }
  }
};
