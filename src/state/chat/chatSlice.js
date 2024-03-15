import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   userChats: [],
   mensagens: [],
   userSelecionado: null,
   uidChatSelecionado: "",
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
      setUidChatSeleciodado: (state, action) => {
         state.uidChatSelecionado = action.payload;
      },
   },
});

export const { setUserChats, setMensagens, setUserSelecionado, setUidChatSeleciodado } = chatSlice.actions;

export default chatSlice.reducer;
