import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebar/sidebarSlice";

const store = configureStore({ reducer: { sidebar: sidebarReducer } });

export default store;
