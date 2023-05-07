import styles from "./SearchPage.module.css";
import estiloHome from "../Home/Home.module.css";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { SiSpinrilla } from "react-icons/si";
import PostCard from "../../Components/PostCard/PostCard";

const SearchPage = () => {
    const [posts, setPosts] = useState([]);

    const [q] = useSearchParams();

    async function pesquisar(text) {
        setPosts([]);
        let arr = [];
        let q = query(collection(db, "Posts"), where("tags", "array-contains", text));

        let captura = await getDocs(q);

        captura.forEach((v) => {
            arr.push({ data: v.data(), id: v.id });
        });

        console.log(arr);

        setPosts(arr);
    }

    useEffect(() => {
        pesquisar(q.get("q"));
    }, [q]);

    return (
        <div id={estiloHome.container}>
            <div id={estiloHome.left}>
                <h2>
                    Resultados da pesquisa por: <span style={{ textDecoration: "underline" }}>{q.get("q")}</span>
                </h2>
                <div id={estiloHome.duasCol}>
                    {/*Caso cheguem posts do banco de dados */}
                    {posts.length > 0 ? (
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
                                        objecto={post.data}
                                    />
                                );
                            })}
                        </>
                    ) : (
                        <SiSpinrilla id={estiloHome.loading} />
                    )}
                </div>
            </div>
            <div id={estiloHome.right}></div>
        </div>
    );
};

export default SearchPage;
