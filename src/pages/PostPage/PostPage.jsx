import { useLocation } from "react-router-dom";
import styles from "./PostPage.module.css";
import estiloHome from "../Home/Home.module.css";
import { HiUserCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import {BsCalendar2DateFill} from "react-icons/bs"
import {AiFillTags} from "react-icons/ai"

const PostPage = () => {
    const objecto = useLocation().state;
    const [TagsOrg, setTagsOrg] = useState("")
    const [data, setData] = useState("");

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

    useEffect(()=> {
        organizar(objecto.tags)
        toDateTime(objecto.criadoEm.seconds)
    }, [objecto])

    return (
        <div id={estiloHome.container}>
            <div id={estiloHome.left}>
                <h2 id={styles.tit}>{objecto.titulo}</h2>
                <div id={styles.fundo}>
                    <img src={objecto.imagem} id={styles.img} alt="Imagem de destaque" />

                    <div id={styles.line}>
                        <div>
                            <HiUserCircle size={23} />

                            <p>{objecto.criadoPor}</p>
                        </div>
                        <div>
                            <BsCalendar2DateFill size={23} />

                            <p>{data}</p>
                        </div>
                        <div>
                            <AiFillTags size={23} />

                            <p>{TagsOrg}</p>
                        </div>
                    </div>

                    <p id={styles.conteudo} dangerouslySetInnerHTML={{ __html: objecto.conteudo }}></p>
                </div>
            </div>
            <div id={estiloHome.right}></div>
        </div>
    );
};

export default PostPage;
