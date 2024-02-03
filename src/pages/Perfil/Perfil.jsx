import React, { useRef } from "react";
import styles from "./Perfil.module.css";
import { useSelector } from "react-redux";
import fotoDemo from "../../Images/me.png";

// Icons
import { FaUserEdit } from "react-icons/fa";

const Perfil = () => {
   const { user } = useSelector((state) => state.user);
   const nome_usuario_ref = useRef(null);
   const email_usuario_ref = useRef(null);

   function carregarFoto() {
      return; //  TODO
   }

   function removerFoto() {
      return; //  TODO
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
                  <img src={fotoDemo} alt="Foto de perfil do usuário" />
               </figure>
            </div>
            <div id={styles.right}>
               <button id={styles.loadBtn}>Carregar nova foto</button>
               <button id={styles.removeBtn}>Remover foto</button>
            </div>
         </div>
         <form id={styles.form}>
            <fieldset>
               <label htmlFor="">Nome do usuário:</label>
               <input value={user.displayName} ref={nome_usuario_ref} required type="text" placeholder="Insira o novo nome do usuário" />
            </fieldset>
            <fieldset>
               <label htmlFor="">Email:</label>
               <input value={user.email} ref={email_usuario_ref} required type="email" placeholder="Insira o seu novo email" />
            </fieldset>
            <fieldset>
               <label htmlFor="">Senha:</label>
               <input ref={email_usuario_ref} required type="password" placeholder="Insira a nova senha" />
            </fieldset>
            <button>Salvar</button>
         </form>
      </div>
   );
};

export default Perfil;
