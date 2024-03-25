import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostCard.module.css";
import Esqueleto from "../Esqueleto/Esqueleto";
import converterSegundoParaData from "../../hooks/useConverterSegundoParaData";
import useOrganizarTags from "../../hooks/useOrganizarTags";

const PostCard = ({ linkAtivo = false, objecto, conteudo, titulo, autor, data, imagem, tagsInical, id }) => {
   const [descricao, setDescricao] = useState("");
   const navegar = useNavigate();

   function convertHtmtoString(str) {
      let element = document.createElement("div");
      element.innerHTML = str;
      return element.innerText;
   }

   //  Reduzindo o texto do conteúdo do post
   function reduzir(str, maxlength) {
      setDescricao(convertHtmtoString(str.length > maxlength ? str.slice(0, maxlength - 1) + "…" : str));
   }

   useEffect(() => {
      if (conteudo?.length > 10) reduzir(conteudo, 70);
   }, [conteudo]);

   return (
      <div
         id={styles.container}
         onClick={() => {
            if (linkAtivo == false) {
               navegar(`posts/${id}`, { state: objecto });
            } else {
               navegar(`/posts/${id}`, { state: objecto });
            }
         }}
      >
         <div id={styles.left}>{imagem ? <img src={imagem} loading="lazy" alt="imagem de post" /> : <Esqueleto tipo={"thumbnail"} />}</div>
         {tagsInical && titulo && descricao && autor ? (
            <div id={styles.right}>
               <p id={styles.tags}>{useOrganizarTags(tagsInical)}</p>
               <h4>{titulo}</h4>
               <p id={styles.descricao}>{descricao}</p>
               <p id={styles.autor}>
                  Por <strong>{autor}</strong>
               </p>
               <p id={styles.dataCorrigida}>{converterSegundoParaData(data?.seconds)}</p>
            </div>
         ) : (
            <div id={styles.rightEsqueleto}>
               <Esqueleto tipo={"tagsCard"} />
               <Esqueleto tipo={"tituloCard"} />
               <Esqueleto tipo={"textoCard"} />
               <Esqueleto tipo={"textoCard"} />
               <Esqueleto tipo={"criadoPorCard"} />
            </div>
         )}
      </div>
   );
};

export default PostCard;
