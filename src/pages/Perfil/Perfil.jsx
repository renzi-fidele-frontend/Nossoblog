import React, { useRef, useState } from "react";
import styles from "./Perfil.module.css";
import { useSelector } from "react-redux";
import fotoDemo from "../../Images/me.png";

// Icons
import { FaUserEdit } from "react-icons/fa";

const Perfil = () => {
   const { user } = useSelector((state) => state.user);
   const nome_ref = useRef(null);
   const email_ref = useRef(null);
   const [alterado, setAlterado] = useState(false);

   function carregarFoto() {
      return; //  TODO
   }

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
         <form autoComplete={false} id={styles.form}>
            <fieldset>
               <label htmlFor="">Nome do usuário:</label>
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
               <label htmlFor="">Email:</label>
               <input
                  onChange={handleChange}
                  defaultValue={user.email}
                  ref={email_ref}
                  required
                  type="email"
                  placeholder="Insira o seu novo email"
               />
            </fieldset>

            <button style={{ opacity: !alterado && "0.5", transition: "all 0.3s ease-out" }} disabled={!alterado}>
               Salvar
            </button>
         </form>
      </div>
   );
};

export default Perfil;
