import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SideBar.module.css";

//  Firebase
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";

//  Redux
import { useDispatch, useSelector } from "react-redux";
import { setPostsEmDestaque, setTagsPopulares } from "../../state/sidebar/sidebarSlice";

//  Icones
import { FaSearch } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { ImCross } from "react-icons/im";

const SideBar = ({ customClass }) => {
   const { postsEmDestaque, tagsPopulares } = useSelector((state) => state.sidebar);
   const dispatch = useDispatch();

   const [q, setQ] = useState("");

   const navegar = useNavigate();

   //  Pesquisando pela tag em cada documento da coleção
   function pesquisar(text) {
      navegar(`/pesquisa?q=${text}`);
   }

   //  Pegando os posts e as tags em destaque
   async function pegarPosts() {
      let arr = [];
      let q = query(collection(db, "Posts"), orderBy("vezesLido", "desc"), limit(5));
      let captura = await getDocs(q);
      captura.forEach((doc) => {
         arr.push({ data: doc.data(), id: doc.id });
      });

      dispatch(setPostsEmDestaque(arr));

      let ar = [];
      arr.forEach((val) => {
         val.data.tags.forEach((v) => {
            if (ar.includes(v) === false) {
               ar.push(v);
            }
         });
      });
      dispatch(setTagsPopulares(ar.slice(0, 5)));
   }

   useEffect(() => {
      if (postsEmDestaque.length === 0 && tagsPopulares.length === 0) pegarPosts();
   }, []);

   const divRef = useRef();

   //  Tornar sideBar responsivo
   function ToggleClass() {
      divRef.current.classList.toggle(styles.responsivo);
   }

   return (
      <>
         <section id={styles.container} ref={divRef} className={customClass}>
            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  pesquisar(q);
               }}
            >
               <input type="text" name="q" required onChange={(e) => setQ(e.target.value)} id="query" placeholder="Ou busque por tags" />
               <button id={styles.btn}>
                  <FaSearch color="red" id={styles.ico} path="white" title="pesquisar" />
               </button>
            </form>
            {/*Caso cheguem as tags populares */}
            <h3>Tags populares</h3>
            <div id={styles.tagsContainer}>
               {tagsPopulares ? (
                  tagsPopulares.map((val, ind) => {
                     return <Link to={`/pesquisa?q=${val}`}>#{val}</Link>;
                  })
               ) : (
                  <p>...</p>
               )}
            </div>
            {/*Caso cheguem os posts em destaque */}
            <h3>Posts em destaque</h3>
            <div id={styles.PopularPostsContainer}>
               {postsEmDestaque?.length > 0 ? (
                  postsEmDestaque.map((val, ind) => {
                     return (
                        <Link key={ind} to={`/posts/${val.id}`} state={val}>
                           {val.data.titulo}
                        </Link>
                     );
                  })
               ) : (
                  <p>...</p>
               )}
            </div>

            {/*Anúncios do google adsense*/}
            <div id={styles.adsContainer}>
               <script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5665219260825839"
                  crossorigin="anonymous"
               ></script>
               {/*Ads 0*/}
               <ins
                  className="adsbygoogle"
                  style={{ display: "block" }}
                  data-ad-client="ca-pub-5665219260825839"
                  data-ad-slot="7844556496"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
               ></ins>
               <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>{" "}
            </div>

            <ImCross onClick={ToggleClass} className={styles.fechar} />
         </section>
         <div id={styles.iconsContainer}>
            <BsLayoutTextSidebarReverse onClick={ToggleClass} className={styles.btn} />
            <FcSearch onClick={ToggleClass} className={styles.searchBtn} />
         </div>
      </>
   );
};

export default SideBar;
