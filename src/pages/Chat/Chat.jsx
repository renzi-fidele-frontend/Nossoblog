import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Chat.module.css";
import { useSelector } from "react-redux";
import Conversa from "../../Components/Conversa/Conversa";

//  Icons
import { FaSearch } from "react-icons/fa";
import userImg from "../../Images/user.png";
import { FaSpinner } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import SmoothScrollbar from "smooth-scrollbar";
import { IoPersonAddOutline } from "react-icons/io5";

const Chat = () => {
   const { user } = useSelector((state) => state.user);
   const [resultadosPesquisa, setResultadosPesquisa] = useState([]);
   const searchInputRef = useRef(null);
   const [loading, setLoading] = useState(false);
   const ctRef = useRef();

   async function pesquisar(e) {
      e.preventDefault();

      if (searchInputRef.current.value.length > 2) {
         setLoading(true);
         const usersRef = collection(db, "Users");
         const q = query(
            usersRef,
            where("nome", ">=", searchInputRef.current.value),
            where("nome", "<=", searchInputRef.current.value + "\uf8ff")
         );
         const chamada = await getDocs(q);
         let arr = [];
         chamada.forEach((doc) => {
            arr.push(doc.data());
         });
         setResultadosPesquisa(arr);
         console.log(resultadosPesquisa);
         setLoading(false);
      } else {
         alert("Insira no mínimo 3 caractéres");
      }
   }

   function capitalizar(str) {
      let modStr = str[0].toUpperCase() + str.slice(1);
      return modStr;
   }

   return (
      <div id={styles.ct}>
         <div
            ref={ctRef}
            onLoad={(e) => {
               SmoothScrollbar.init(ctRef.current);
            }}
            id={styles.left}
         >
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

            {loading && (
               <i id={styles.loadIco}>
                  <FaSpinner />
               </i>
            )}

            {/*Mostrando os resultados da pesquisa somente ao se pesquisar */}
            {resultadosPesquisa.length > 0 && (
               <div id={styles.users} className={styles.itemsPesquisa}>
                  <div id={styles.cima}>
                     <h6>Resultados da pesquisa</h6>
                     <button
                        onClick={() => {
                           setResultadosPesquisa([]);
                        }}
                     >
                        Fechar
                     </button>
                  </div>

                  {resultadosPesquisa.map((v, k) => (
                     <div id={styles.userCard} title="Adicionar usuário" className={styles.userCard} key={k}>
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

            <div id={styles.users}>
               {[1, 2, 3, 4, 5].map((v, k) => (
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
