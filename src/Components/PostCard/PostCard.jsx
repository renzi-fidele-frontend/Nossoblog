import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostCard.module.css";


const PostCard = ({ conteudo, titulo, autor, data, imagem, tagsInical, id }) => {
    const [descricao, setDescricao] = useState("");
    const [tags, setTags] = useState("");
    const [dataCorrigida, setDataCorrigida] = useState("")

    const navegar = useNavigate()

    //  Convertendo o tempo em segundos para formato de data
    function toDateTime(secs) {
        let t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);

        let dd = t.getDate();
        let mm = t.getMonth();
        let yyyy = t.getFullYear();
        let frase = `${dd}/${mm}/${yyyy}`;
        setDataCorrigida(frase);
    }

    //  Reduzindo o texto do conteúdo do post
    function reduzir(str, maxlength) {
        setDescricao(str.length > maxlength ? str.slice(0, maxlength - 1) + "…" : str);
    }

    //  Orgazizando as tags a mostrar
    function organizar(tags) {
        var frase = "";
        tags.forEach((v) => {
            frase += `#${v} `
        });
        setTags(frase)
    }

    useEffect(() => {
        toDateTime(data.seconds);
        reduzir(conteudo, 70);
        organizar(tagsInical)
    }, [tagsInical, data]);

    return (
        <div id={styles.container} onClick={()=> { navegar(`posts/${id}`) }}>
            <div id={styles.left}>
                <img src={imagem} alt="imagem de post" />
            </div>
            <div id={styles.right}>
                <p id={styles.tags}>{tags}</p>
                <h4>{titulo}</h4>
                <p id={styles.descricao}>{descricao}</p>
                <p id={styles.autor}>Por <strong>{autor}</strong></p>
                <p id={styles.dataCorrigida}>{dataCorrigida}</p>

            </div>
        </div>
    );
};

export default PostCard;
