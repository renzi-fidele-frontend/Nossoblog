import styles from "./SearchPage.module.css";
import estiloHome from "../Home/Home.module.css";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { SiSpinrilla } from "react-icons/si";

const SearchPage = () => {
    const [posts, setPosts] = useState([]);

    const [q] = useSearchParams();

    async function pesquisar(text) {
        setResposta(`Resultados da pesquisa por: ${text}`);
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
        pesquisar(q.get("q"))

    }, [q]);

    return (
        <div id={estiloHome.container}>
            <div id={estiloHome.left}>
                {/*Caso cheguem posts do banco de dados */}
                {posts.length > 0 ? <h2>Ola</h2> : <SiSpinrilla id={estiloHome.loading}/>}
            </div>
            <div id={estiloHome.right}></div>
        </div>
    );
};

export default SearchPage;
