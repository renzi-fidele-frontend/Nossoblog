import React from "react";
import styles from "./CardMensagem.module.css";
import useAnalisarData from "../../../hooks/useAnalisarData";
import useConverterSegundoParaFormatoDeHora from "../../../hooks/useConverterSegundoParaFormatoDeHora";

// Tooltip
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import "tippy.js/themes/translucent.css";

const CardMensagem = ({ fotoRemetente, senderId, fotoDestinatario, fotoMensagem, textoMensagem, enviadoEm }) => {
   return (
      <div className={styles.msg} id={senderId === fotoRemetente ? styles.enviado : styles.recebido}>
         <div>
            <img className={styles.fotoUser} src={senderId === fotoRemetente ? fotoRemetente : fotoDestinatario} alt="Foto do usuário" />
            <span>{useConverterSegundoParaFormatoDeHora(enviadoEm)}</span>
         </div>
         <Tippy content={useAnalisarData(enviadoEm)}>
            <div className={styles.conteudoMsg}>
               {textoMensagem?.length > 0 && <p>{textoMensagem}</p>}
               {fotoMensagem?.length > 0 && <img src={fotoMensagem} alt="" />}
            </div>
         </Tippy>
      </div>
   );
};

export default CardMensagem;
