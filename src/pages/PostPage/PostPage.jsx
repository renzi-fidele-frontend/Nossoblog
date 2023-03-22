import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase/config";
import styles from "./PostPage.module.css";
import estiloHome from "../Home/Home.module.css";

const PostPage = () => {
    const objecto = useLocation().state;

    return (
        <div id={estiloHome.container}>
            <div id={estiloHome.left}>
                <h2 id={styles.tit}>{objecto.titulo}</h2>
                <div id={styles.fundo}>
                    <img src={objecto.imagem} id={styles.img} alt="Imagem de destaque" />
                    <p id={styles.conteudo} dangerouslySetInnerHTML={{__html: objecto.conteudo}}></p>
                </div>
            </div>
            <div id={estiloHome.right}></div>
        </div>
    );
};

export default PostPage;
