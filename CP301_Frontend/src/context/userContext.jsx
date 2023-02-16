import { createContext, useReducer } from "react";
import { userReducer } from "../reducer/userReducer";

const pastUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: pastUser ? pastUser : null,
  pending: false,
  error: false,
  message: "",
  loggedin: pastUser ? true : false,
};

export const userContext = createContext(initialState);

export const UserContextProvider = ({children}) => {
  const [user, dispatch] = useReducer(userReducer, initialState);

  return (
    <userContext.Provider value={{ user, dispatch }}>
      {children}
    </userContext.Provider>
  );
};
