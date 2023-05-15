import React, { useEffect, useState } from "react";
import styles from "./SideBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaSearch } from "react-icons/fa";

const SideBar = () => {
    const [q, setQ] = useState("");
    const [tagsPopulares, setTagsPopulares] = useState(undefined);
    const [postsDestacados, setPostsDestacados] = useState(undefined);

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

        setPostsDestacados(arr);

        let ar = [];
        arr.map((val) => {
            val.data.tags.filter((v) => {
                if (v in ar) {
                    return false;
                } else {
                    ar.push(v);
                }
            });
        });
        setTagsPopulares(ar.slice(0, 5));
    }

    useEffect(() => {
        pegarPosts();
    }, []);

    return (
        <section id={styles.container}>
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
                {postsDestacados ? (
                    postsDestacados.map((val, ind) => {
                        return (
                            <Link to={`/posts/${val.id}`} state={val}>
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
                    crossOrigin="anonymous"
                ></script>

                <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-5665219260825839"
                    data-ad-slot="5562695478"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                ></ins>
                <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
            </div>
        </section>
    );
};

export default SideBar;
