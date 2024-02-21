import estiloHome from "../Home/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { SiSpinrilla } from "react-icons/si";
import PostCard from "../../Components/PostCard/PostCard";
import SideBar from "../../Components/SideBar/SideBar";
import styles from "./SearchPage.module.css";
import ft from "../../Images/Interdit.svg";
import SmoothScrollbar from "smooth-scrollbar";

const SearchPage = () => {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const ctRef = useRef(null);

   const [q] = useSearchParams();

   async function pesquisar(text) {
      setLoading(true);
      setPosts([]);
      let arr = [];
      let q = query(collection(db, "Posts"), where("tags", "array-contains", text));

      let captura = await getDocs(q);

      captura.forEach((v) => {
         arr.push({ data: v.data(), id: v.id });
      });

      console.log(arr);

      setPosts(arr);
      setLoading(false);
   }

   useEffect(() => {
      pesquisar(q.get("q"));
   }, [q]);

   useEffect(() => {
      SmoothScrollbar.init(ctRef.current);
   }, []);

   return (
      <div id={estiloHome.container}>
         <div ref={ctRef} id={estiloHome.left}>
            <h2>
               Resultados da pesquisa por: <span style={{ textDecoration: "underline" }}>{q.get("q")}</span>
            </h2>
            <div id={estiloHome.duasCol}>
               {/*Caso cheguem posts do banco de dadosd */}
               {posts.length > 0 && (
                  <>
                     {posts.map((post, id) => {
                        return (
                           <PostCard
                              linkAtivo={true}
                              conteudo={post.data.conteudo}
                              imagem={post.data.imagem}
                              titulo={post.data.titulo}
                              data={post.data.criadoEm}
                              autor={post.data.criadoPor}
                              tagsInical={post.data.tags}
                              id={post.id}
                              objecto={post}
                           />
                        );
                     })}
                  </>
               )}
               {/*Caso os posts estejam sendo carregados */}
               {loading === true && <SiSpinrilla id={estiloHome.loading} />}
            </div>
            {/*Caso não haja nenhum resultado */}
            {loading === false && posts.length === 0 && (
               <>
                  <img id={styles.notFoundImg} src={ft} alt="icone respresentando erro de pesquisa" />
                  <p id={styles.notfound}>Nenhum resultado foi encontrado</p>
               </>
            )}
         </div>
         <div id={estiloHome.right}>
            <SideBar />
         </div>
      </div>
   );
};

export default SearchPage;
