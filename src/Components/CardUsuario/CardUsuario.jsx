import React from "react";
import styles from "./CardUsuario.module.css";
import { useSelector } from "react-redux";

// Tooltip
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import "tippy.js/themes/light.css";
import useAnalisarData from "../../hooks/useAnalisarData";
import capitalizar from "../../hooks/useCapitalizar";
import { useAbreviar } from "../../hooks/useAbreviar";

const CardUsuario = ({ fotoUsuario, nomeUsuario, onClick, atualizadoEm, userUid, ultimaMensagem, modoPesquisa }) => {
   const { userSelecionado } = useSelector((state) => state.chat);

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
};

export default CardUsuario;
