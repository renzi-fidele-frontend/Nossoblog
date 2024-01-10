import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   tagsPopulares: [],
   postsEmDestaque: [],
};

const sidebarSlice = createSlice({
   name: "sidebar",
   initialState,
   reducers: {
      setPostsEmDestaque: (state, action) => {
         state.postsEmDestaque = action.payload;
      },
      setTagsPopulares: (state, action) => {
         state.tagsPopulares = action.payload;
      },
   },
});

export const { setPostsEmDestaque, setTagsPopulares } = sidebarSlice.actions;

export default sidebarSlice.reducer;
