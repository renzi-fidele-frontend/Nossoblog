import React, { useEffect, useState } from "react";
import styles from "./SideBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";

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

        setPosts(arr);
    }
    async function pegarTags() {
        let q = query(collection(db, "Posts"), orderBy("vezesLido", "desc"));

        let captura = await getDocs(q);
    }

    useEffect(()=> {
        pegarPosts()
    }, [])


    return (
        <section id={styles.container}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    pesquisar(q);
                }}
            >
                <input type="text" name="q" required onChange={(e) => setQ(e.target.value)} id="query" placeholder="Ou busque por tags" />
                <button>Pesquisar</button>
            </form>
            {/*Caso cheguem as tags populares */}
            <h3>Tags populares</h3>
            <div id={styles.tagsContainer}></div>
            {/*Caso cheguem os posts em destaque */}
            <h3>Posts em destaque</h3>
            <div id={styles.PopularPostsContainer}>
                {postsDestacados ? (
                    postsDestacados.map(val, (ind) => {
                        <Link to={`/posts/${val.id}`}>{val.data.titulo}</Link>;
                    })
                ) : (
                    <p>Sem nada a mostrar</p>
                )}
            </div>
        </section>
    );
};

export default SideBar;
