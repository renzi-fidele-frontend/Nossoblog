import React, { useEffect, useRef, useState } from "react";
import styles from "./Conversa.module.css";
import { useSelector } from "react-redux";
import SmoothScrollbar from "smooth-scrollbar";
import capitalizar from "../../hooks/useCapitalizar";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase/config";

// Assets
import { AiOutlinePicture, AiOutlineUpload } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import ill from "../../Images/semMensagem.png";
import load from "../../Images/ball-triangle.svg";
import CardMensagem from "./CardMensagem/CardMensagem";

const Conversa = ({ loadingMsg = false }) => {
   const { user } = useSelector((state) => state.user);
   const { mensagens, userSelecionado, uidChatSelecionado } = useSelector((state) => state.chat);
   const scrollRef = useRef(null);
   const textoMsgRef = useRef(null);
   const inputFileRef = useRef(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (uidChatSelecionado.length > 0 && userSelecionado !== null) {
      }
   }, [uidChatSelecionado, userSelecionado]);

   async function enviarMensagem(e) {
      e.preventDefault();
      setLoading(true);
      // Caso haja uma imagem inserida ou não
      if (inputFileRef?.current?.files?.length > 0) {
         console.log("Enviando mensagem com imagem...");

         let file = inputFileRef?.current?.files[0];
         const imageRef = ref(storage, `FotosMensagens/${v4() + file.name}`);
         uploadBytesResumable(imageRef, file).then((v) => {
            getDownloadURL(v.ref).then(async (link) => {
               // Atualizar a imagem na coleção
               let msgRef = doc(db, "Chats", uidChatSelecionado);
               await updateDoc(msgRef, {
                  mensagens: arrayUnion({
                     id: v4(),
                     texto: textoMsgRef.current.value,
                     senderId: user.uid,
                     imagem: link,
                     enviadoEm: Timestamp.now(),
                  }),
               })
                  .then(async () => {
                     // Atualizando a última mensagem enviada, na coleção das conversas do remente e do destinatário
                     await updateDoc(doc(db, "UserChats", user.uid), {
                        [uidChatSelecionado + ".ultimaMensagem"]: {
                           texto: "Foto",
                           enviadoEm: Timestamp.now(),
                        },
                     });
                     await updateDoc(doc(db, "UserChats", userSelecionado.uid), {
                        [uidChatSelecionado + ".ultimaMensagem"]: {
                           texto: "Foto",
                           enviadoEm: Timestamp.now(),
                        },
                     });
                     SmoothScrollbar.get(scrollRef.current).scrollTo(0, 10000);
                     console.log("Mensagem enviada com sucesso");
                     textoMsgRef.current.value = "";
                     inputFileRef.current.files = [];
                  })
                  .catch((err) => console.log(err));
            });
         });
      } else if (textoMsgRef?.current?.value?.length > 0) {
         console.log("Enviando mensagem sem imagem...");

         let msgRef = doc(db, "Chats", uidChatSelecionado);
         await updateDoc(msgRef, {
            mensagens: arrayUnion({
               id: v4(),
               texto: textoMsgRef?.current?.value,
               senderId: user.uid,
               enviadoEm: Timestamp.now(),
            }),
         })
            .then(async () => {
               // Atualizando a última mensagem enviada na coleção das conversas do usuário
               await updateDoc(doc(db, "UserChats", user.uid), {
                  [uidChatSelecionado + ".ultimaMensagem"]: {
                     texto: textoMsgRef?.current?.value,
                     enviadoEm: serverTimestamp(),
                  },
               });
               await updateDoc(doc(db, "UserChats", userSelecionado.uid), {
                  [uidChatSelecionado + ".ultimaMensagem"]: {
                     texto: textoMsgRef?.current?.value,
                     enviadoEm: serverTimestamp(),
                  },
               });
            })
            .then(() => {
               console.log("Mensagem enviada com sucesso");
               SmoothScrollbar.get(scrollRef.current).scrollTo(0, 10000);
               textoMsgRef.current.value = "";
            })
            .catch((err) => console.log(err));
      }
      setLoading(false);
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
               SmoothScrollbar.init(scrollRef.current).scrollTo(0, 10000);
            }}
            id={styles.chatBody}
         >
            <div id={styles.mensagens}>
               {mensagens?.length > 0 &&
                  mensagens?.map((v, k) => {
                     return (
                        <CardMensagem
                           senderId={v?.senderId}
                           fotoRemetente={user?.photoURL}
                           fotoDestinatario={userSelecionado?.photoURL}
                           fotoMensagem={v?.imagem}
                           textoMensagem={v?.texto}
                           enviadoEm={v?.enviadoEm?.seconds}
                           key={k}
                        />
                     );
                  })}

               {mensagens?.length === 0 && !loadingMsg && (
                  <div id={styles.nenhumaMsgCt}>
                     <img src={ill} />
                     <p>Nenhuma mensagem foi enviada</p>
                  </div>
               )}
            </div>
         </div>
         <form onSubmit={enviarMensagem} id={styles.input}>
            <input ref={textoMsgRef} type="text" placeholder="Escreva a mensagem aqui..." />
            <div>
               <input type="file" ref={inputFileRef} hidden id="imgFile" />

               <label htmlFor="imgFile">
                  <AiOutlinePicture title="Carregar imagem" />
               </label>

               <IoSend onClick={enviarMensagem} title="Enviar" />
            </div>
         </form>

         {loading && (
            <div id={styles.loadCt}>
               <img src={load} alt="" />
            </div>
         )}
      </div>
   );
};

export default Conversa;
