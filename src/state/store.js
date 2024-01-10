import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebar/sidebarSlice";
import userReducer from "./user/userSlice";
import homeReducer from "./home/homeSlice";

const store = configureStore({ reducer: { sidebar: sidebarReducer, user: userReducer, home: homeReducer } });

export default store;
