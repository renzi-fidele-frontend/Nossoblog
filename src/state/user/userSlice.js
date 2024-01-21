import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null, userPosts: undefined };

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload;
      },
      setUserPosts: (state, action) => {
         state.userPosts = action.payload;
      },
   },
});

export const { setUser, setUserPosts } = userSlice.actions;

export default userSlice.reducer;
