import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HeroContainer.module.css";

const HeroContainer = ({ imagem, conteudo, titulo, criadoPor, criadoEm, tags, id, objecto }) => {
    const [data, setData] = useState("");
    const [tagsOrg, setTagsOrg] = useState([]);

    const navegar = useNavigate();

    //  Orgazizando as tags a mostrar
    function organizar(tags) {
        var frase = "";
        tags.forEach((v) => {
            frase += `#${v} `;
        });
        setTagsOrg(frase);
    }

    //  Convertendo o tempo em segundos para formato de data
    function toDateTime(secs) {
        let t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);
        setData(t);
        let dd = t.getDate();
        let mm = t.getMonth();
        let yyyy = t.getFullYear();
        let frase = `${dd}/${mm}/${yyyy}`;
        setData(frase);
    }

    useEffect(() => {
        toDateTime(criadoEm);
        organizar(tags);
    }, [criadoEm, tags]);

    return (
        <div id={styles.container}>
            <img
                src={imagem}
                onClick={() => {
                    navegar(`/posts/${id}`, { state: objecto });
                }}
                loading="lazy"
                alt="Imagem do post"
            />
            <br />
            <Link state={objecto} to={`/posts/${id}`}>
                {" "}
                {titulo}
            </Link>
            <p id={styles.data}>
                {data} - Por {criadoPor} <span>{tagsOrg}</span>
            </p>
        </div>
    );
};

export default HeroContainer;
