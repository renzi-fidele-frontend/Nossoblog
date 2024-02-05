import React, { useRef, useState } from "react";
import styles from "./Perfil.module.css";
import { useSelector } from "react-redux";
import fotoDemo from "../../Images/me.png";
import semFotoPerfil from "/src/Images/noprofile.jpg";

// Icons
import { FaUserEdit } from "react-icons/fa";
import { updateProfile } from "firebase/auth";
import { v4 } from "uuid";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase/config";
import checkIfImageExists from "../../hooks/useCheckIfImageExists";

const Perfil = () => {
   const { user } = useSelector((state) => state.user);
   const nome_ref = useRef(null);
   const email_ref = useRef(null);
   const [alterado, setAlterado] = useState(false);
   const [fotoPerfil, setFotoPerfil] = useState(null);
   const [linkFoto, setLinkFoto] = useState("");

   function removerFoto() {
      return; //  TODO
   }

   // Ativando o botão de salvar somente após uma mudança
   function handleChange() {
      if (user.displayName === nome_ref.current?.value && user.email === email_ref.current?.value) {
         setAlterado(false);
      } else {
         setAlterado(true);
      }
   }

   //  Adicionando a imagem ao DB
   async function uploadImagem() {
      const imageRef = ref(storage, `fotosPerfil/${fotoPerfil.name + v4()}`);
      uploadBytes(imageRef, fotoPerfil).then((v) => {
         getDownloadURL(v.ref).then(async (link) => {
            setLinkFoto(link);
         });
      });
   }

   async function atualizarPerfil(e, comImagem = false) {
      e.preventDefault();
      if (comImagem) {
         if (fotoPerfil.length > 0) {
            uploadImagem();
            await updateProfile(user, { displayName: nome_ref.current.value, photoURL: linkFoto })
               .then(() => {
                  console.log("Perfil atualizado com sucesso!");
               })
               .catch((err) => {
                  console.log(err.code, err.message);
               });
         }
      } else {
         await updateProfile(user, { displayName: nome_ref.current.value })
            .then(() => {
               console.log("Perfil atualizado com sucesso!");
            })
            .catch((err) => {
               console.log(err.code, err.message);
            });
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
                  {linkFoto.length > 0 ? (
                     <img src={fotoDemo} alt="Foto de perfil do usuário" />
                  ) : (
                     <img src={semFotoPerfil} alt="Foto de perfil do usuário" />
                  )}
               </figure>
            </div>
            <div id={styles.right}>
               <input
                  hidden
                  type="file"
                  id="fotoPerfil"
                  accept="image/*"
                  onChange={(e) => {
                     console.log(`Foto carregada: ${e.target.files[0]}`);
                     setFotoPerfil(e.target.files[0]);
                  }}
               />
               <label for="fotoPerfil" id={styles.loadBtn}>
                  Carregar nova foto
               </label>
               <button id={styles.removeBtn}>Remover foto</button>
            </div>
         </div>
         <form onSubmit={atualizarPerfil} autoComplete={false} id={styles.form}>
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
      </div>
   );
};

export default Perfil;
