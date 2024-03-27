import React, { useEffect, useRef } from "react";
import styles from "./Conversa.module.css";
import { useSelector } from "react-redux";
import SmoothScrollbar from "smooth-scrollbar";

// React Icons
import { AiOutlinePicture, AiOutlineUpload } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import capitalizar from "../../hooks/useCapitalizar";
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import useConverterSegundoParaFormatoDeHora from "../../hooks/useConverterSegundoParaFormatoDeHora";

const Conversa = () => {
   const { user } = useSelector((state) => state.user);
   const { mensagens, userSelecionado, uidChatSelecionado } = useSelector((state) => state.chat);
   const scrollRef = useRef(null);
   const textoMsgRef = useRef(null);
   const inputFileRef = useRef(null);

   useEffect(() => {
      if (uidChatSelecionado.length > 0 && userSelecionado !== null) {
      }
   }, [uidChatSelecionado, userSelecionado]);

   async function enviarMensagem(e) {
      e.preventDefault();
      // Caso haja uma imagem inserida ou não
      if (inputFileRef?.current?.files?.length > 0) {
         console.log("Enviando mensagem com imagem...");

         let file = inputFileRef?.current?.files[0];
         const imageRef = ref(storage, `FotosMensagens/${v4() + file.name}`);
         uploadBytesResumable(imageRef, file).then((v) => {
            getDownloadURL(v.ref).then(async (link) => {
               console.log(`O link é: ${link}`);
            });
         });
      } else if (textoMsgRef?.current?.value?.length > 0) {
         console.log("Enviando mensagem sem imagem...");

         let msgRef = doc(db, "Chats", uidChatSelecionado);
         await updateDoc(msgRef, {
            mensagens: arrayUnion({
               id: v4(),
               texto: textoMsgRef.current.value,
               senderId: user.uid,
               enviadoEm: Timestamp.now(),
            }),
         })
            .then(async () => {
               await updateDoc(doc(db, "UserChats", user.uid), {
                  [uidChatSelecionado + ".ultimaMensagem"]: {
                     texto: textoMsgRef.current.value,
                     enviadoEm: Timestamp.now(),
                  },
               }).then(console.log("Última mensagem foi atualizada"));
               console.log("Mensagem enviada com sucesso");
               textoMsgRef.current.value = "";
               console.log(res);
            })
            .catch((err) => console.log(err));
      }
   }

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
               {mensagens?.map((v, k) => {
                  console.log(v);
                  return (
                     <div key={k} className={styles.msg} id={v?.senderId === user?.uid ? styles.enviado : styles.recebido}>
                        <div>
                           <img className={styles.fotoUser} src={user?.photoURL} alt="Foto do usuário" />
                           <span>{useConverterSegundoParaFormatoDeHora(v?.enviadoEm)}</span>
                        </div>
                        <div className={styles.conteudoMsg}>{v?.texto}</div>
                     </div>
                  );
               })}

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
            <input ref={textoMsgRef} type="text" placeholder="Escreva a mensagem aqui..." />
            <div>
               <input type="file" ref={inputFileRef} hidden id="file1" />
               <input type="file" ref={inputFileRef} hidden id="imgFile" />

               <label htmlFor="file1">
                  <AiOutlineUpload title="Carregar ficheiro" />
               </label>
               <label htmlFor="imgFile">
                  <AiOutlinePicture title="Carregar imagem" />
               </label>

               <IoSend onClick={enviarMensagem} title="Enviar" />
            </div>
         </form>
      </div>
   );
};

export default Conversa;
