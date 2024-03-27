import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HeroContainer.module.css";
import { motion } from "framer-motion";
import Esqueleto from "../Esqueleto/Esqueleto";
import useConverterSegundoParaData from "../../hooks/useConverterSegundoParaData";
import useOrganizarTags from "../../hooks/useOrganizarTags";

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;

const HeroContainer = ({ imagem, titulo, criadoPor, criadoEm, tags, id, objecto }) => {
   const navegar = useNavigate();
   const [isLoaded, setIsLoaded] = useState(false);
   const [isInView, setIsInView] = useState(false);

   return (
      <>
         {imagem && titulo && criadoPor && criadoEm && tags ? (
            <motion.div
               id={styles.container}
               initial={false}
               animate={
                  isLoaded && isInView
                     ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
                     : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
               }
               transition={{ duration: 1 }}
               viewport={{ once: true }}
               onViewportEnter={() => setIsInView(true)}
            >
               <img
                  src={imagem}
                  onLoad={() => setIsLoaded(true)}
                  onClick={() => {
                     navegar(`/posts/${id}`, { state: objecto });
                  }}
                  loading="lazy"
                  alt="Imagem do post"
               />
               <br />
               <Link state={objecto} to={`/posts/${id}`}>
                  {titulo}
               </Link>
               <p id={styles.data}>
                  {useConverterSegundoParaData(criadoEm)} - Por {criadoPor} <span>{useOrganizarTags(tags)}</span>
               </p>
            </motion.div>
         ) : (
            <div id={styles.container}>
               <Esqueleto tipo={"heroImg"} />
               <br />
               <Esqueleto tipo={"tituloHero"} />
               <br />
               <Esqueleto tipo={"data"} />
               <Esqueleto tipo={"data"} />
            </div>
         )}
      </>
   );
};

export default HeroContainer;
