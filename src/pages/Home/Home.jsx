import styles from "./Home.module.css";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useEffect, useState } from "react";
import HeroContainer from "../../Components/HeroContainer/HeroContainer";
import PostCard from "../../Components/PostCard/PostCard";
import { SiSpinrilla } from "react-icons/si";
import SideBar from "../../Components/SideBar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/home/homeSlice";

const Home = () => {
   const { posts } = useSelector((state) => state.home);
   const dispatch = useDispatch();

   //  Capturar dados na coleção Posts
   async function capturarPosts() {
      let arr = [];
      let q = query(collection(db, "Posts"), orderBy("criadoEm", "desc"));

      let captura = await getDocs(q);

      captura.forEach((doc) => {
         arr.push({ data: doc.data(), id: doc.id });
      });

      dispatch(setPosts(arr));
   }

   useEffect(() => {
      if (posts.length === 0) capturarPosts();
   }, []);

   return (
      <section id={styles.container}>
         <div id={styles.left}>
            {/*Caso cheguem posts do banco de dados */}
            {posts.length > 0 ? (
               <>
                  <h2>Veja os nossos posts mais recentes</h2>
                  <HeroContainer
                     objecto={posts[0]}
                     criadoEm={posts[0].data.criadoEm.seconds}
                     criadoPor={posts[0].data.criadoPor}
                     titulo={posts[0].data.titulo}
                     imagem={posts[0].data.imagem}
                     tags={posts[0].data.tags}
                     id={posts[0].id}
                  />
                  <div id={styles.duasCol}>
                     {posts.map((post, id) => {
                        if (id !== 0) {
                           return (
                              <PostCard
                                 objecto={post}
                                 conteudo={post.data.conteudo}
                                 imagem={post.data.imagem}
                                 titulo={post.data.titulo}
                                 data={post.data.criadoEm}
                                 autor={post.data.criadoPor}
                                 tagsInical={post.data.tags}
                                 id={post.id}
                              />
                           );
                        }
                     })}
                  </div>
               </>
            ) : (
               <SiSpinrilla id={styles.loading} />
            )}
         </div>
         <div id={styles.right}>
            <SideBar customClass={styles.sidebar} />
         </div>
      </section>
   );
};

export default Home;
