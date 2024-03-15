import React, { useEffect, useRef } from "react";
import styles from "./Conversa.module.css";
import { useSelector } from "react-redux";
import SmoothScrollbar from "smooth-scrollbar";

// React Icons
import { AiOutlinePicture, AiOutlineUpload } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import foto from "../../Images/fotoMSG.jpg";
import capitalizar from "../../hooks/useCapitalizar";

const Conversa = () => {
   const { user } = useSelector((state) => state.user);
   const { mensagens, userSelecionado } = useSelector((state) => state.chat);
   const scrollRef = useRef(null);
   const { uidChatSelecionado } = useSelector((state) => state.chat);

   useEffect(() => {
      if (uidChatSelecionado.length > 0) {
         console.log(`A UID do chat selecionado é: ${uidChatSelecionado}`);
      }
   }, [uidChatSelecionado]);

   return (
      <div id={styles.ct}>
         <div id={styles.head}>
            <h5>{capitalizar(userSelecionado?.nome)}</h5>
            <p>Estado online</p>
         </div>
         <div
            ref={scrollRef}
            onLoad={() => {
               SmoothScrollbar.init(scrollRef.current);
            }}
            id={styles.chatBody}
         >
            <div id={styles.mensagens}>
               {/* Modelo de mensagem recebida */}
               {mensagens.map((v, k) => (
                  <div key={k} className={styles.msg} id={styles.recebido}>
                     <div>
                        <img className={styles.fotoUser} src={user?.photoURL} alt="Foto do usuário" />
                        <span>08:30</span>
                     </div>
                     <div className={styles.conteudoMsg}>Texto da mensagem</div>
                  </div>
               ))}

               {/* Modelo de mensagem enviada */}
               {[].map((v, k) => (
                  <div key={k} className={styles.msg} id={styles.enviado}>
                     <div>
                        <img className={styles.fotoUser} src={user?.photoURL} alt="Foto do usuário" />
                        <span>08:30</span>
                     </div>
                     <div className={styles.conteudoMsg}>Texto da mensagem</div>
                  </div>
               ))}

               {/* Modelo de mensagem contendo imagem 
               <div className={styles.msg} id={styles.enviado}>
                  <div>
                     <img className={styles.fotoUser} src={user?.photoURL} alt="Foto do usuário" />
                     <span>08:30</span>
                  </div>
                  <div className={styles.conteudoMsg}>
                     <img src={foto} alt="" />
                  </div>
               </div>
               */}
            </div>
         </div>
         <form id={styles.input}>
            <input type="text" placeholder="Escreva a mensagem aqui..." />
            <div>
               <input type="file" hidden id="file1" />
               <input type="file" hidden id="imgFile" />

               <label htmlFor="file1">
                  <AiOutlineUpload title="Carregar ficheiro" />
               </label>
               <label htmlFor="imgFile">
                  <AiOutlinePicture title="Carregar imagem" />
               </label>

               <IoSend title="Enviar" />
            </div>
         </form>
      </div>
   );
};

export default Conversa;
