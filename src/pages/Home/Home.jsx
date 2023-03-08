import styles from "./Home.module.css";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useEffect, useState } from "react";
import HeroContainer from "../../Components/HeroContainer/HeroContainer";
import PostCard from "../../Components/PostCard/PostCard";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [data, setData] = useState(null);

    //  Capturar dados na coleção Posts
    async function capturarPosts() {
        let arr = [];
        let q = query(collection(db, "Posts"));

        let captura = await getDocs(q);

        captura.forEach((doc) => {
            console.log(doc.data());
            arr.push(doc.data());
        });
        console.log(arr);

        setPosts(arr);
    }

    useEffect(() => {
        capturarPosts();
    }, []);

    return (
        <section id={styles.container}>
            <div id={styles.left}>
                {/*Caso cheguem posts do banco de dados */}
                {posts.length > 0 ? (
                    <>
                        <h2>Veja os nossos posts mais recentes</h2>
                        <HeroContainer
                            criadoEm={posts[0].criadoEm.seconds}
                            criadoPor={posts[0].criadoPor}
                            titulo={posts[0].titulo}
                            imagem={posts[0].imagem}
                        ></HeroContainer>
                        <div id={styles.duasCol}>
                            {posts.map((post, id) => {
                                if (id !== 0) {
                                    return (
                                        <PostCard
                                            conteudo={post.conteudo}
                                            imagem={post.imagem}
                                            titulo={post.titulo}
                                            data={post.criadoEm}
                                            autor={post.criadoPor}
                                            tagsInical={post.tags}
                                        />
                                    );
                                }
                            })}
                        </div>
                    </>
                ) : undefined}
            </div>
            <div id={styles.right}>
                <form>
                    <input type="text" name="query" id="query" placeholder="Ou busque por tags" />
                    <button>Pesquisar</button>
                </form>
                <h3>Posts em destaque</h3>
                <ul>
                    <li>
                        <a href="">Amor a primeira vista</a>
                    </li>
                    <li>
                        <a href="">Como andar de biscileta</a>
                    </li>
                    <li>
                        <a href="">Como aprender programação</a>
                    </li>
                    <li>
                        <a href="">Como será a geração de futuro</a>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default Home;
