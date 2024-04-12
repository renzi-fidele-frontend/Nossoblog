import React, { useState } from "react";
import styles from "./CardMensagem.module.css";
import useAnalisarData from "../../../hooks/useAnalisarData";
import useConverterSegundoParaFormatoDeHora from "../../../hooks/useConverterSegundoParaFormatoDeHora";
import { useSelector } from "react-redux";

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Tooltip
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

const CardMensagem = ({ fotoRemetente, senderId, fotoDestinatario, fotoMensagem, textoMensagem, enviadoEm }) => {
   const [open, setOpen] = useState(false);
   const { user } = useSelector((state) => state?.user);

   return (
      <div className={styles.msg} id={senderId === user?.uid ? styles.enviado : styles.recebido}>
         <div>
            <img className={styles.fotoUser} src={senderId === user?.uid ? fotoRemetente : fotoDestinatario} alt="Foto do usuário" />
            <span>{useConverterSegundoParaFormatoDeHora(enviadoEm)}</span>
         </div>
         <Tippy content={useAnalisarData(enviadoEm)}>
            <div className={styles.conteudoMsg}>
               {textoMensagem?.length > 0 && <p>{textoMensagem}</p>}
               {fotoMensagem?.length > 0 && (
                  <>
                     <img
                        onClick={() => {
                           setOpen(true);
                        }}
                        src={fotoMensagem}
                        alt=""
                     />
                     <Lightbox slides={[{ src: fotoMensagem }]} open={open} close={() => setOpen(false)} />
                  </>
               )}
            </div>
         </Tippy>
      </div>
   );
};

export default CardMensagem;
