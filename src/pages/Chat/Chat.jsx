import React, { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import { useSelector } from "react-redux";
import Conversa from "../../Components/Conversa/Conversa";

//  Icons
import { FaSearch } from "react-icons/fa";
import userImg from "../../Images/user.png";
import { FaSpinner } from "react-icons/fa";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import SmoothScrollbar from "smooth-scrollbar";
import { IoPersonAddOutline } from "react-icons/io5";

const Chat = () => {
   const { user } = useSelector((state) => state.user);
   const [resultadosPesquisa, setResultadosPesquisa] = useState([]);
   const searchInputRef = useRef(null);
   const [loading, setLoading] = useState(false);
   const ctRef = useRef(null);

   async function pesquisar(e) {
      e.preventDefault();

      if (searchInputRef.current.value.length > 2) {
         let txt = searchInputRef.current.value.toString().toLowerCase();
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

   function capitalizar(str) {
      let modStr = str[0].toUpperCase() + str.slice(1);
      return modStr;
   }

   async function adicionarUsuario(userSelecionado) {
      // Combinação da UID do usúario logado e o UID do usuário selecionado
      // Forçando a criação da UID combinada a sempre iniciar pela UID mais comprida
      let uid_combinado = user.uid > userSelecionado?.uid ? user.uid + userSelecionado?.uid : userSelecionado?.uid + user.uid;

      console.log(uid_combinado);

      // Verificando se o usuário selecionado foi adicionado às conversas
      let res = await getDoc(doc(db, "Chats", uid_combinado));

      console.log("adicionando...");

      // Caso não tenha sido adicionado, inicializando uma nova conversa
      if (!res.exists()) {
         console.log("A conversa ainda não foi criada");

         await setDoc(doc(db, "Chats", uid_combinado), { mensagens: [] });

         // Não dá pra usar template literals no updateDoc, somente array
         await updateDoc(doc(db, "UserChats", user.uid), {
            [uid_combinado + ".userInfo"]: {
               uid: userSelecionado.uid,
               nome: userSelecionado.nome,
               photoURL: userSelecionado.photoURL,
            },
            [uid_combinado + ".criadoEm"]: serverTimestamp(),
         })
            .then(() => {
               console.log(`Chat inicializado com sucesso`);
            })
            .catch((err) => console.error("err"));
      }
   }

   async function apanharConversas() {
      let res = await getDocs(collection(db, "UserChats"));
      res.forEach((doc) => {
         console.log(doc.data());
      });
   }

   useEffect(() => {
      if (ctRef.current !== null) SmoothScrollbar.init(ctRef.current);
   }, [ctRef.current]);

   useEffect(() => {
      apanharConversas();
   }, []);

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
                        <div
                           onClick={() => {
                              adicionarUsuario(v);
                           }}
                           id={styles.userCard}
                           title="Adicionar usuário"
                           className={styles.userCard}
                           key={k}
                        >
                           <div id={styles.left}>
                              <img src={v?.photoURL} alt="" />
                           </div>
                           <div id={styles.right}>
                              <h5>{capitalizar(v?.nome)}</h5>
                              <IoPersonAddOutline className={styles.addUserIco} />
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Conversas do usuário */}
            <div id={styles.users}>
               {[1].map((v, k) => (
                  <div id={styles.userCard} key={k}>
                     <div id={styles.left}>
                        <img src={user?.photoURL} alt="" />
                     </div>
                     <div id={styles.right}>
                        <h5>Nome completo</h5>
                        <p>Última mensagem</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div id={styles.right}>
            <Conversa />
         </div>
      </div>
   );
};

export default Chat;
