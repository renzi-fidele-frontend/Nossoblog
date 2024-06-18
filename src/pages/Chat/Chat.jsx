import React, { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import { useDispatch, useSelector } from "react-redux";
import Conversa from "../../Components/Conversa/Conversa";
import { query, collection, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import SmoothScrollbar from "smooth-scrollbar";
import { setMensagens, setUidChatSeleciodado, setUserChats, setUserSelecionado } from "../../state/chat/chatSlice";
import noChat from "../../Images/noChat.png";
import semUsuario from "../../Images/semUsusario.png";
import CardUsuario from "../../Components/CardUsuario/CardUsuario";

//  Icons
import { FaSearch } from "react-icons/fa";
import userImg from "../../Images/user.png";
import { FaSpinner } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";

// Tooltip
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

// Drawer
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const Chat = () => {
   const { user } = useSelector((state) => state.user);
   const { userSelecionado, uidChatSelecionado } = useSelector((state) => state.chat);
   const [resultadosPesquisa, setResultadosPesquisa] = useState([]);
   const searchInputRef = useRef(null);
   const searchInputRefMobile = useRef(null);
   const [loading, setLoading] = useState(false);
   const ctRef = useRef(null);
   const [drawerAberto, setDrawerAberto] = useState(false);
   const [isSmallDevice, setIsSmallDevice] = useState(false);

   // Redux
   const { userChats } = useSelector((state) => state.chat);
   const dispatch = useDispatch();

   async function pesquisar(e) {
      e.preventDefault();
      let _query = searchInputRef.current.value || searchInputRefMobile.current.value;

      if (_query?.length > 2) {
         let txt = _query.toString().toLowerCase();
         setLoading(true);
         const usersRef = collection(db, "Users");
         const q = query(usersRef, where("nome", ">=", txt), where("nome", "<=", txt + "\uf8ff"));
         const chamada = await getDocs(q);
         let arr = [];
         chamada.forEach((doc) => {
            arr.push(doc.data());
         });
         setResultadosPesquisa(arr);
         setLoading(false);
      } else {
         alert("Insira no mínimo 3 caractéres");
      }
   }

   async function adicionarUsuario(userSelecionado) {
      setLoading(true);
      console.log(userSelecionado.uid);

      // Combinação da UID do usúario logado e o UID do usuário selecionado
      // Forçando a criação da UID combinada a sempre iniciar pela UID mais comprida
      let uid_combinado = user.uid > userSelecionado?.uid ? user.uid + userSelecionado?.uid : userSelecionado?.uid + user.uid;

      // Verificando se o usuário selecionado foi adicionado às conversas
      let res = await getDoc(doc(db, "Chats", uid_combinado));

      // Caso não tenha sido adicionado, inicializando uma nova conversa
      if (!res.exists()) {
         await setDoc(doc(db, "Chats", uid_combinado), { mensagens: [] });

         // Não dá pra usar template literals no updateDoc, somente array

         // Inicializando a conversa para o remetente
         await updateDoc(doc(db, "UserChats", user.uid), {
            [uid_combinado + ".userInfo"]: {
               uid: userSelecionado.uid,
               nome: userSelecionado.nome,
               photoURL: userSelecionado.photoURL,
            },
            [uid_combinado + ".criadoEm"]: serverTimestamp(),
         })
            .then((r) => console.log("Conversa do destinatário inicializada"))
            .catch((err) => console.error("err"));

         // Inicializando a conversa para o destinatário
         await updateDoc(doc(db, "UserChats", userSelecionado.uid), {
            [uid_combinado + ".userInfo"]: {
               uid: user.uid,
               nome: user.displayName,
               photoURL: user.photoURL,
            },
            [uid_combinado + ".criadoEm"]: serverTimestamp(),
         })
            .then((r) => console.log(r))
            .catch((err) => console.error(err));
      } else {
         console.log("A conversa já existe");
         setResultadosPesquisa([]);
         //
         searchInputRef.current.value = "";
      }

      setLoading(false);
   }

   function apanharConversasUsuario() {
      let snapRef = doc(db, "UserChats", user?.uid);

      let res = onSnapshot(snapRef, (conversas) => {
         // Convertendo o objeto para array, para que possa ser mapeado
         let obj = Object.entries(conversas.data());
         obj.sort((a, b) => b[1]?.ultimaMensagem?.enviadoEm?.seconds - a[1]?.ultimaMensagem?.enviadoEm?.seconds);
         dispatch(setUserChats(obj));
      });
   }

   function apanharMensagensdoUserSelecionado(selectedUser) {
      let uid_combinado = user.uid > selectedUser?.uid ? user.uid + selectedUser?.uid : selectedUser?.uid + user.uid;

      dispatch(setUidChatSeleciodado(uid_combinado));

      let snapRef = doc(db, "Chats", uid_combinado);

      let res = onSnapshot(snapRef, (mensagens) => {
         dispatch(setMensagens(mensagens?.data()?.mensagens));
      });
   }

   // Controlando se o dispositivo é de largura menor do que 370px
   useEffect(() => {
      const handleResize = () => {
         const mediaQuerie = window.matchMedia("(max-width: 380px)");
         setIsSmallDevice(mediaQuerie.matches);
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      // Fazendo o clean Up
      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   useEffect(() => {
      apanharConversasUsuario();
   }, [user?.uid]);

   useEffect(() => {
      apanharMensagensdoUserSelecionado(userSelecionado);
   }, [uidChatSelecionado]);

   useEffect(() => {
      if (ctRef.current !== null) SmoothScrollbar.init(ctRef.current);
   }, [ctRef.current]);

   return (
      <div id={styles.ct}>
         <div ref={ctRef} id={styles.left}>
            <div id={styles.userCt}>
               <h2>Chat Global</h2>
               <div>
                  <img src={userImg} alt="" />
                  <p>{user?.displayName}</p>
               </div>
            </div>
            <form id={styles.form} onSubmit={pesquisar}>
               <input ref={searchInputRef} type="text" placeholder="Encontre um usuário" />
               <button type="submit">
                  <FaSearch />
               </button>
            </form>

            <div>
               {loading && (
                  <i id={styles.loadIco}>
                     <FaSpinner />
                  </i>
               )}
            </div>

            {/* Mostrando os resultados da pesquisa somente ao se pesquisar */}
            <div>
               {resultadosPesquisa.length > 0 && (
                  <div id={styles.users} className={styles.itemsPesquisa}>
                     <div id={styles.cima}>
                        <h6>Resultados da pesquisa</h6>
                        <button onClick={() => setResultadosPesquisa([])}>Fechar</button>
                     </div>

                     {resultadosPesquisa.map((v, k) => (
                        <CardUsuario
                           onClickPesquisado={() => {
                              adicionarUsuario(v);
                           }}
                           key={k}
                           modoPesquisa={true}
                           fotoUsuario={v?.photoURL}
                           nomeUsuario={v?.nome}
                        />
                     ))}
                  </div>
               )}
            </div>

            {/* Conversas do usuário */}
            <div id={styles.users}>
               {userChats.length > 0 ? (
                  userChats?.map((v, k) => (
                     <CardUsuario
                        modoPesquisa={false}
                        onClick={() => {
                           dispatch(setUserSelecionado(v[1]?.userInfo));
                           apanharMensagensdoUserSelecionado(v[1]?.userInfo);
                        }}
                        atualizadoEm={v[1]?.ultimaMensagem?.enviadoEm?.seconds}
                        userUid={v[1]?.userInfo?.uid}
                        nomeUsuario={v[1]?.userInfo?.nome}
                        ultimaMensagem={v[1]?.ultimaMensagem?.texto}
                        fotoUsuario={v[1]?.userInfo?.photoURL}
                        key={k}
                     />
                  ))
               ) : (
                  <div id={styles.noUserCt}>
                     <img src={semUsuario} alt="" />
                     <p>Nenhum usuário foi adicionado</p>
                  </div>
               )}
            </div>
         </div>
         <div id={styles.right}>
            {userSelecionado ? (
               <Conversa />
            ) : (
               <div id={styles.semConversaCt}>
                  <img src={noChat} alt="" />
                  <p>Nenhuma conversa foi selecionada</p>
               </div>
            )}
         </div>

         {/*Botão para abrir o Drawer */}
         <Tippy content="Ver conversas">
            <button onClick={() => setDrawerAberto(true)} id={styles.abrirDrawer}>
               <IoLogoWechat />
            </button>
         </Tippy>

         {/*Drawer do responsivo mobile */}
         <Drawer
            size={isSmallDevice ? 290 : 340}
            lockBackgroundScroll={true}
            direction="left"
            className={styles.drawerCt}
            open={drawerAberto}
            onClose={() => setDrawerAberto(false)}
         >
            <div id={styles.userCt}>
               <h2>Chat Global</h2>
               <div>
                  <img src={user?.photoURL} id={styles.ftPerfilMobile} />
               </div>
            </div>
            <form id={styles.form} onSubmit={pesquisar}>
               <input ref={searchInputRefMobile} type="text" placeholder="Encontre um usuário" />
               <button type="submit">
                  <FaSearch />
               </button>
            </form>

            <div>
               {loading && (
                  <i id={styles.loadIco}>
                     <FaSpinner />
                  </i>
               )}
            </div>

            {/* Mostrando os resultados da pesquisa somente ao se pesquisar */}
            <div>
               {resultadosPesquisa.length > 0 && (
                  <div id={styles.users} className={styles.itemsPesquisa}>
                     <div id={styles.cima}>
                        <h6>Resultados da pesquisa</h6>
                        <button onClick={() => setResultadosPesquisa([])}>Fechar</button>
                     </div>

                     {resultadosPesquisa.map((v, k) => (
                        <CardUsuario
                           onClickPesquisado={() => {
                              adicionarUsuario(v);
                           }}
                           key={k}
                           modoPesquisa={true}
                           fotoUsuario={v?.photoURL}
                           nomeUsuario={v?.nome}
                        />
                     ))}
                  </div>
               )}
            </div>

            {/* Conversas do usuário */}
            <div id={styles.users}>
               {userChats.length > 0 ? (
                  userChats?.map((v, k) => (
                     <CardUsuario
                        modoPesquisa={false}
                        onClick={() => {
                           dispatch(setUserSelecionado(v[1]?.userInfo));
                           apanharMensagensdoUserSelecionado(v[1]?.userInfo);
                           setDrawerAberto(false);
                        }}
                        atualizadoEm={v[1]?.ultimaMensagem?.enviadoEm?.seconds}
                        userUid={v[1]?.userInfo?.uid}
                        nomeUsuario={v[1]?.userInfo?.nome}
                        ultimaMensagem={v[1]?.ultimaMensagem?.texto}
                        fotoUsuario={v[1]?.userInfo?.photoURL}
                        key={k}
                     />
                  ))
               ) : (
                  <div id={styles.noUserCt}>
                     <img src={semUsuario} alt="" />
                     <p>Nenhum usuário foi adicionado</p>
                  </div>
               )}
            </div>
         </Drawer>
      </div>
   );
};

export default Chat;
