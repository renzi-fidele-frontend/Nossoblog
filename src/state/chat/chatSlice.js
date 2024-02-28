import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   userChats: [],
};

const chatSlice = createSlice({
   name: "chat",
   initialState,
   reducers: {
      setUserChats: (state, action) => {
         state.userChats = action.payload;
      },
   },
});

export const { setUserChats } = chatSlice.actions;
export default chatSlice.reducer;
