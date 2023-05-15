import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HeroContainer.module.css";
import { motion } from "framer-motion";

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;

const HeroContainer = ({ imagem, titulo, criadoPor, criadoEm, tags, id, objecto }) => {
    const [data, setData] = useState("");
    const [tagsOrg, setTagsOrg] = useState([]);

    const navegar = useNavigate();

    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

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
        let t = new Date(secs * 1000); // Epoch
        let dd = t.getDate();
        let mm = t.getMonth() + 1;
        let yyyy = t.getFullYear();
        let frase = `${dd}/${mm}/${yyyy}`;
        setData(frase);
    }

    useEffect(() => {
        toDateTime(criadoEm);
        organizar(tags);
    }, [criadoEm, tags]);

    return (
        <motion.div
            id={styles.container}
            initial={false}
            animate={
                isLoaded && isInView
                    ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
                    : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
            }
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            onViewportEnter={() => setIsInView(true)}
        >
            <img
                src={imagem}
                onLoad={() => setIsLoaded(true)}
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
        </motion.div>
    );
};

export default HeroContainer;
