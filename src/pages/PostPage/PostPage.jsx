import { Link, useLocation } from "react-router-dom";
import styles from "./PostPage.module.css";
import estiloHome from "../Home/Home.module.css";
import { HiUserCircle } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { BsCalendar2DateFill } from "react-icons/bs";
import { AiFillTags } from "react-icons/ai";
import SideBar from "../../Components/SideBar/SideBar";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion } from "framer-motion";
import useScrollTop from "../../hooks/useScrollTop";
import SmoothScrollbar from "smooth-scrollbar";

const PostPage = () => {
   const objecto = useLocation().state;
   const [TagsOrg, setTagsOrg] = useState("");
   const [data, setData] = useState("");
   const ctRef = useRef(null);

   const scrollTop = useScrollTop({ divRef: ctRef.current });

   //  Convertendo o tempo em segundos para formato de data
   function toDateTime(secs) {
      let t = new Date(secs * 1000); // Epoch
      let dd = t.getDate();
      let mm = t.getMonth() + 1;
      let yyyy = t.getFullYear();
      let frase = `${dd}/${mm}/${yyyy}`;
      setData(frase);
   }

   //  Aumentando o número de vezes lido
   function aumentarViews() {
      updateDoc(doc(db, "Posts", objecto.id), {
         vezesLido: increment(1),
      })
         .then(() => console.log("Numero de vezes lidas aumentada!"))
         .catch((err) => console.log(err));
   }

   useEffect(() => {
      toDateTime(objecto.data.criadoEm.seconds);
   }, [objecto]);

   useEffect(() => {
      aumentarViews();
      SmoothScrollbar.init(ctRef.current);
   }, []);

   return (
      <div id={estiloHome.container}>
         <motion.div
            initial={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            animate={{ x: 0, opacity: 1 }}
            id={estiloHome.left}
            ref={ctRef}
         >
            <h2 id={styles.tit}>{objecto.data.titulo}</h2>
            <div id={styles.fundo}>
               <img src={objecto.data.imagem} id={styles.img} alt="Imagem de destaque" />

               <div id={styles.line}>
                  <div>
                     <HiUserCircle size={23} />

                     <p>{objecto.data.criadoPor}</p>
                  </div>
                  <div>
                     <BsCalendar2DateFill size={23} />

                     <p>{data}</p>
                  </div>
                  <div>
                     <AiFillTags size={23} />
                     <div id={styles.tagsOrg}>
                        {objecto.data.tags.map((v, id) => {
                           return (
                              <Link id={id} to={`/pesquisa/?q=${v}`}>
                                 #{v}
                              </Link>
                           );
                        })}
                     </div>
                     <p>{TagsOrg}</p>
                  </div>
               </div>

               <div id={styles.conteudo} dangerouslySetInnerHTML={{ __html: objecto.data.conteudo }}></div>
            </div>
         </motion.div>
         <div id={estiloHome.right}>
            <SideBar />
         </div>
      </div>
   );
};

export default PostPage;
