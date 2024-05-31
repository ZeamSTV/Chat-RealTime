import { createContext, useContext, useReducer } from "react";
import { AuthConstext } from "./AuthProvider";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser } = useContext(AuthConstext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };
  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.userId > action.payload.userId
              ? currentUser.userId + action.payload.userId
              : action.payload.userId + currentUser.userId,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
