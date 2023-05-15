import { useEffect, useState } from "react";
import styles from "./CriarPost.module.css";
import { db } from "../../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { AuthValue } from "../../context/AuthContent";
import { useNavigate } from "react-router-dom";
import foto from "../../Images/postalbox.svg";
import { motion } from "framer-motion";

const CriarPost = () => {
    //  Hooks do formulário
    const [titulo, setTitulo] = useState("");
    const [imagem, setImagem] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [erroFormulario, setErroFormulario] = useState("");

    const navegar = useNavigate();

    //  Pegando o valor global do Contexto
    const { user } = AuthValue();

    useEffect(() => {
        console.log(user);
    }, [user]);

    async function publicar(e) {
        e.preventDefault();
        setLoading(true);

        // Verificando se o link da imagem existe
        function checkIfImageExists(url, callback) {
            const img = new Image();
            img.src = url;

            if (img.complete) {
                callback(true);
            } else {
                img.onload = () => {
                    callback(true);
                };

                img.onerror = () => {
                    callback(false);
                };
            }
        }

        checkIfImageExists(imagem, async (exists) => {
            if (exists) {
                //  Adicionando a publicação à base de dados
                const docRef = await addDoc(collection(db, "Posts"), {
                    titulo: titulo,
                    imagem: imagem,
                    conteudo: conteudo,
                    tags: tags.split(",").map((v) => v.trim()),
                    criadoEm: Timestamp.now(),
                    criadoPor: user.displayName,
                    uid: user.uid,
                    vezesLido: 0,
                })
                    .then((v) => {
                        setLoading(false);
                        console.log(v);
                    })
                    .catch((err) => console.log(`Ops, Não foi possível fazer a publicação. ${err}`));

                //  Resetando os campos do formulário
                setTitulo("");
                setImagem("");
                setConteudo("");
                setTags([]);

                //  Redirecionando a home
                navegar("/");
            } else {
                setErroFormulario("A imagem deve conter uma url válida");
                setTimeout(() => setErroFormulario(""), 3000);
            }
        });
    }

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            id={styles.container}
        >
            <img src={foto} alt="ilustração de criação de post" />
            <h2>Criar post</h2>
            <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
            <form onSubmit={publicar}>
                <fieldset>
                    <label htmlFor="titulo">Título</label>
                    <input
                        type="text"
                        placeholder="Pense num bom título"
                        name="titulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="imgUrl">URL da imagem</label>
                    <input
                        type="text"
                        placeholder="Insira uma imagem que representa o seu post"
                        name="imgUrl"
                        value={imagem}
                        onChange={(e) => setImagem(e.target.value)}
                        required
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="conteudo">Conteúdo</label>
                    <textarea
                        name="conteudo"
                        placeholder="Insira o conteúdo do post"
                        value={conteudo}
                        onChange={(e) => setConteudo(e.target.value)}
                        required
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="tags">Tags</label>
                    <input
                        type="text"
                        name="tags"
                        placeholder="Insira as tags separadas por vírgula"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        required
                    />
                </fieldset>
                <button>Publicar</button>
                {/*Caso a senha de confirmação não coincida com a senha */}
                {erroFormulario.length > 0 ? (
                    <p style={{ color: "red", position: "absolute", marginTop: "4px", fontWeight: "600" }}>{erroFormulario}</p>
                ) : undefined}
            </form>
        </motion.section>
    );
};

export default CriarPost;
