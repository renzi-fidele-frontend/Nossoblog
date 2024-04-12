import React, { useRef, useState } from "react";
import styles from "./CardMensagem.module.css";
import useAnalisarData from "../../../hooks/useAnalisarData";
import useConverterSegundoParaFormatoDeHora from "../../../hooks/useConverterSegundoParaFormatoDeHora";
import { useSelector } from "react-redux";

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Download from "yet-another-react-lightbox/plugins/download";

// Tooltip
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

const CardMensagem = ({ fotoRemetente, senderId, fotoDestinatario, fotoMensagem, textoMensagem, enviadoEm }) => {
   const [open, setOpen] = useState(false);
   const { user } = useSelector((state) => state?.user);
   const zoomRef = useRef(null);
   const fullscreenRef = useRef(null);

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
                     <Lightbox
                        zoom={{ ref: zoomRef }}
                        plugins={[Zoom, Fullscreen, Download]}
                        slides={[{ src: fotoMensagem }]}
                        fullscreen={{ ref: fullscreenRef }}
                        open={open}
                        close={() => setOpen(false)}
                     />
                  </>
               )}
            </div>
         </Tippy>
      </div>
   );
};

export default CardMensagem;
