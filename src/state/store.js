import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebar/sidebarSlice";
import userReducer from "./user/userSlice";
import homeReducer from "./home/homeSlice";
import chatReducer from "./chat/chatSlice";

const store = configureStore({ reducer: { sidebar: sidebarReducer, user: userReducer, home: homeReducer, chat: chatReducer } });

export default store;
