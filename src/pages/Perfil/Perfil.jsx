import React, { useRef, useState } from "react";
import styles from "./Perfil.module.css";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
// Firebase
import { updateEmail, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/config";
// Icons
import { FaUserEdit } from "react-icons/fa";
import animatedSvg from "../../Images/animatedLoading.svg";
import semFotoPerfil from "../../Images/noProfile.jpg";

const Perfil = () => {
   const { user } = useSelector((state) => state.user);
   const nome_ref = useRef(null);
   const email_ref = useRef(null);
   const [alterado, setAlterado] = useState(false);
   const [linkFoto, setLinkFoto] = useState(user?.photoURL);
   const inputfileRef = useRef(null);
   const [loading, setLoading] = useState(false);

   // Ativando o botão de salvar somente após uma mudança
   function handleChange() {
      if (user.displayName === nome_ref.current?.value && user.email === email_ref.current?.value) {
         setAlterado(false);
      } else {
         setAlterado(true);
      }
   }

   async function atualizarEmail(novoEmail) {
      await updateEmail(user, novoEmail)
         .then(() => {
            email_ref.current.value = novoEmail;
         })
         .catch((err) => console.log("Ops, aconteceu o erro: ", err));
   }

   async function atualizarPerfil(comImagem) {
      setLoading(true);
      if (email_ref.current.value !== user?.email) atualizarEmail(email_ref.current.value);
      if (comImagem) {
         let file = inputfileRef?.current?.files[0];
         const imageRef = ref(storage, `fotosPerfil/${v4() + file.name}`);
         uploadBytes(imageRef, file)
            .then((v) => {
               getDownloadURL(v.ref).then(async (link) => {
                  console.log(`O link é: ${link}`);
                  setLinkFoto(link);
                  await updateProfile(user, { displayName: nome_ref.current.value, photoURL: link })
                     .then(() => {
                        setLoading(false);
                     })
                     .catch((err) => {
                        console.log(err.code, err.message);
                     });
               });
            })
            .catch((err) => console.log(`Erro, ${err} ao carregar a imagem ao DB`));
         
      } else {
         await updateProfile(user, { displayName: nome_ref.current.value })
            .then(() => {
               
               setLoading(false);
            })
            .catch((err) => {
               console.log(err.code, err.message);
            });
      }
      setAlterado(false);
   }

   async function removerFoto() {
      if (linkFoto.length > 0) {
         setLoading(true);
         await updateProfile(user, {
            photoURL:
               "https://firebasestorage.googleapis.com/v0/b/miniblog-c5fa5.appspot.com/o/fotosPerfil%2FnoProfile.jpg?alt=media&token=086b913b-26ae-4c73-a6da-0785fd5b958c",
         })
            .then(() => {
               console.log("Foto de perfil removida com sucesso!");
               setLinkFoto(
                  "https://firebasestorage.googleapis.com/v0/b/miniblog-c5fa5.appspot.com/o/fotosPerfil%2FnoProfile.jpg?alt=media&token=086b913b-26ae-4c73-a6da-0785fd5b958c"
               );
               setLoading(false);
            })
            .catch((err) => {
               console.log(err.code, err.message);
            });
      } else {
         alert("Você não possúi foto de perfil");
      }
   }

   return (
      <div id={styles.ct}>
         <i>
            <FaUserEdit />
         </i>
         <h2>Configurações do perfil</h2>
         <hr />
         <div id={styles.duasCol}>
            <div id={styles.left}>
               <figure>
                  <img src={linkFoto} key={linkFoto} alt="Foto de perfil do usuário" />
               </figure>
            </div>
            <div id={styles.right}>
               <input
                  hidden
                  type="file"
                  ref={inputfileRef}
                  id="fotoPerfil"
                  accept="image/*"
                  onChange={(e) => {
                     setAlterado(true);
                  }}
               />
               <label for="fotoPerfil" id={styles.loadBtn}>
                  Carregar nova foto
               </label>
               <button onClick={removerFoto} id={styles.removeBtn}>
                  Remover foto
               </button>
            </div>
         </div>
         <form
            onSubmit={(e) => {
               e.preventDefault();
               if (inputfileRef?.current?.files.length > 0) {
                  atualizarPerfil(true);
               } else {
                  atualizarPerfil(false);
               }
            }}
            autoComplete={false}
            id={styles.form}
         >
            <fieldset>
               <label>Nome do usuário:</label>
               <input
                  onChange={handleChange}
                  defaultValue={user.displayName}
                  ref={nome_ref}
                  required
                  type="text"
                  placeholder="Insira o novo nome do usuário"
               />
            </fieldset>
            <fieldset>
               <label>Email:</label>
               <input
                  onChange={handleChange}
                  defaultValue={user.email}
                  ref={email_ref}
                  required
                  type="email"
                  placeholder="Insira o seu novo email"
               />
            </fieldset>

            <button type="submit" style={{ opacity: !alterado && "0.5", transition: "all 0.3s ease-out" }} disabled={!alterado}>
               Salvar
            </button>
         </form>
         {loading && (
            <div id={styles.backdrop}>
               <div id={styles.animCt}>
                  <img src={animatedSvg} alt="loading..." />
               </div>
            </div>
         )}
      </div>
   );
};

export default Perfil;
