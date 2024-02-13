import React from "react";
import styles from "./Chat.module.css";
import { useSelector } from "react-redux";
import Conversa from "../../Components/Conversa/Conversa";

//  Icons
import { FaSearch } from "react-icons/fa";
import userImg from "../../Images/user.png";


const Chat = () => {
   const { user } = useSelector((state) => state.user);

   return (
      <div id={styles.ct}>
         <div id={styles.left}>
            <div id={styles.userCt}>
               <h2>Chat Global</h2>
               <div>
                  <img src={userImg} alt="" />
                  <p>{user?.displayName}</p>
               </div>
            </div>
            <form id={styles.form}>
               <input type="text" placeholder="Encontre um usuário" />
               <button>
                  <FaSearch />
               </button>
            </form>
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
