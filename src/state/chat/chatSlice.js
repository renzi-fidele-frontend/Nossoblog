import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   userChats: [],
   mensagens: [],
   userSelecionado: null,
};

const chatSlice = createSlice({
   name: "chat",
   initialState,
   reducers: {
      setUserChats: (state, action) => {
         state.userChats = action.payload;
      },
      setMensagens: (state, action) => {
         state.mensagens = action.payload;
      },
      setUserSelecionado: (state, action) => {
         state.userSelecionado = action.payload;
      },
   },
});

export const { setUserChats, setMensagens, setUserSelecionado } = chatSlice.actions;

export default chatSlice.reducer;
