import React from "react";
import styles from "./Conversa.module.css";
import { useSelector } from "react-redux";

// React Icons
import { AiOutlinePicture, AiOutlineUpload } from "react-icons/ai";
import { IoSend } from "react-icons/io5";

const Conversa = () => {
   const { user } = useSelector((state) => state.user);

   return (
      <div id={styles.ct}>
         <div id={styles.head}>
            <h5>Nome completo</h5>
            <p>Estado online</p>
         </div>
         <div id={styles.chatBody}>
            <div id={styles.mensagens}>
               {[1, 2, 3, 4, 5, 6, 7, 8].map((v, k) => (
                  <div key={k} className={styles.msg}>
                     <img src={user?.photoURL} alt="Foto do usuário" />
                     <p></p>
                  </div>
               ))}
            </div>
         </div>
         <form id={styles.input}>
            <input type="text" placeholder="Escreva a mensagem aqui..." />
            <div>
               <AiOutlineUpload title="Carregar ficheiro" />
               <AiOutlinePicture title="Carregar imagem" />
               <IoSend title="Enviar" />
            </div>
         </form>
      </div>
   );
};

export default Conversa;
