import React from "react";
import styles from "./Chat.module.css";
import { useSelector } from "react-redux";
import userImg from "../../Images/user.png";

//  Icons
import { FaSearch } from "react-icons/fa";

const Chat = () => {
   const { user } = useSelector((state) => state.user);

   return (
      <div id={styles.ct}>
         <div id={styles.left}>
            <div id={styles.userCt}>
                <h2>Chat Global</h2>
               <div>
                  <img src={userImg} alt="" />
                  <p>Renzi</p>
               </div>
            </div>
            <form>
               <input type="text" placeholder="Encontre um usuário" />
               <button>
                  <FaSearch />
               </button>
            </form>
            <div id={styles.users}></div>
         </div>
         <div id={styles.right}>
            <div id={styles.head}></div>
            <div id={styles.chatBody}></div>
         </div>
      </div>
   );
};

export default Chat;
