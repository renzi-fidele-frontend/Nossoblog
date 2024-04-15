import React from "react";
import styles from "./CardUsuario.module.css";
import { useSelector } from "react-redux";
import useAnalisarData from "../../hooks/useAnalisarData";
import capitalizar from "../../hooks/useCapitalizar";
import { useAbreviar } from "../../hooks/useAbreviar";

// Tooltip
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import "tippy.js/themes/light.css";

//  Icons
import { IoPersonAddOutline } from "react-icons/io5";

const CardUsuario = ({ fotoUsuario, nomeUsuario, onClick, onClickPesquisado, atualizadoEm, userUid, ultimaMensagem, modoPesquisa = false }) => {
   const { userSelecionado } = useSelector((state) => state.chat);

   if (modoPesquisa === false) {
      return (
         <Tippy theme="light" content={useAnalisarData(atualizadoEm)}>
            <div id={styles.userCard} onClick={onClick} className={userSelecionado?.uid === userUid && styles.selecionado}>
               <div id={styles.left}>
                  <img src={fotoUsuario} alt="" />
               </div>
               <div id={styles.right}>
                  <h5>{capitalizar(nomeUsuario)}</h5>
                  <p>{useAbreviar(ultimaMensagem || "Nenhuma mensagem enviada", 29)}</p>
               </div>
            </div>
         </Tippy>
      );
   } else {
      return (
         <Tippy content="Adicionar usuário">
            <div className={styles.userCard} id={styles.userCard} onClick={onClickPesquisado}>
               <div id={styles.left}>
                  <img src={fotoUsuario} alt="" />
               </div>
               <div id={styles.right}>
                  <h5>{capitalizar(nomeUsuario)}</h5>
                  <IoPersonAddOutline className={styles.addUserIco} />
               </div>
            </div>
         </Tippy>
      );
   }
};

export default CardUsuario;
