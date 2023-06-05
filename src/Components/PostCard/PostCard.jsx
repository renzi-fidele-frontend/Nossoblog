import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostCard.module.css";

const PostCard = ({ linkAtivo = false, objecto, conteudo, titulo, autor, data, imagem, tagsInical, id }) => {
    const [descricao, setDescricao] = useState("");
    const [tags, setTags] = useState("");
    const [dataCorrigida, setDataCorrigida] = useState("");

    const navegar = useNavigate();

    //  Convertendo o tempo em segundos para formato de data
    function toDateTime(secs) {
        let t = new Date(secs * 1000); // Epoch
        let dd = t.getDate();
        let mm = t.getMonth() + 1;
        let yyyy = t.getFullYear();
        let frase = `${dd}/${mm}/${yyyy}`;
        setDataCorrigida(frase);
    }

    function convertHtmtoString(str) {
        let element = document.createElement("div");
        element.innerHTML = str;
        return element.innerText;
    }

    //  Reduzindo o texto do conteúdo do post
    function reduzir(str, maxlength) {
        setDescricao(convertHtmtoString(str.length > maxlength ? str.slice(0, maxlength - 1) + "…" : str));
    }

    //  Orgazizando as tags a mostrar
    function organizar(tags) {
        var frase = "";
        tags.forEach((v) => {
            frase += `#${v} `;
        });
        setTags(frase);
    }

    useEffect(() => {
        toDateTime(data.seconds);
        reduzir(conteudo, 70);
        organizar(tagsInical);
    }, [tagsInical, data]);

    return (
        <div
            id={styles.container}
            onClick={() => {
                if (linkAtivo == false) {
                    navegar(`posts/${id}`, { state: objecto });
                } else {
                    navegar(`/posts/${id}`, { state: objecto });
                }
            }}
        >
            <div id={styles.left}>
                <img src={imagem} loading="lazy" alt="imagem de post" />
            </div>
            <div id={styles.right}>
                <p id={styles.tags}>{tags}</p>
                <h4>{titulo}</h4>
                <p id={styles.descricao}>{descricao}</p>
                <p id={styles.autor}>
                    Por <strong>{autor}</strong>
                </p>
                <p id={styles.dataCorrigida}>{dataCorrigida}</p>
            </div>
        </div>
    );
};

export default PostCard;
