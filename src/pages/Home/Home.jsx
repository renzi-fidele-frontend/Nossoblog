import styles from "./Home.module.css";

import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useEffect, useState } from "react";
import HeroContainer from "../../Components/HeroContainer/HeroContainer";
import PostCard from "../../Components/PostCard/PostCard";
import { SiSpinrilla } from "react-icons/si";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const [posts, setPosts] = useState([]);
    const [data, setData] = useState(null);
    const [q, setQ] = useState("");
    const navegar = useNavigate();

    //  Capturar dados na coleção Posts
    async function capturarPosts() {
        let arr = [];
        let q = query(collection(db, "Posts"), orderBy("criadoEm", "desc"));

        let captura = await getDocs(q);

        captura.forEach((doc) => {
            arr.push({ data: doc.data(), id: doc.id });
        });

        setPosts(arr);
    }

    //  Pesquisando pela tag em cada documento da coleção
    function pesquisar(text) {
        navegar(`pesquisa?q=${text}`);
    }

    useEffect(() => {
        capturarPosts();
        if (q.length > 0) {
            pesquisar(q);
        }
    }, []);

    return (
        <section id={styles.container}>
            <div id={styles.left}>
                {/*Caso cheguem posts do banco de dados */}
                {posts.length > 0 ? (
                    <>
                        <h2>Veja os nossos posts mais recentes</h2>
                        <HeroContainer
                            objecto={posts[0].data}
                            criadoEm={posts[0].data.criadoEm.seconds}
                            criadoPor={posts[0].data.criadoPor}
                            titulo={posts[0].data.titulo}
                            imagem={posts[0].data.imagem}
                            tags={posts[0].data.tags}
                            id={posts[0].id}
                        ></HeroContainer>
                        <div id={styles.duasCol}>
                            {posts.map((post, id) => {
                                if (id !== 0) {
                                    return (
                                        <PostCard
                                            objecto={post.data}
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        pesquisar(q);
                    }}
                >
                    <input type="text" name="q" onChange={(e) => setQ(e.target.value)} id="query" placeholder="Ou busque por tags" />
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
