import React, { useEffect, useState } from "react";
import styles from "./EditPost.module.css";
import estiloCriarPost from "../../CriarPost/CriarPost.module.css";
import foto from "../../../Images/ftkedit.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

const EditPost = () => {
    const [titulo, setTitulo] = useState("");
    const [imagem, setImagem] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [tags, setTags] = useState("");
    const [erroFormulario, setErroFormulario] = useState("");

    const objeto = useLocation().state;

    useEffect(() => {
        setTitulo(objeto.data.titulo);
        setImagem(objeto.data.imagem);
        setConteudo(objeto.data.conteudo);
        let frase = "";
        objeto.data.tags.map((v) => {
            frase += v + ", ";
        });

        setTags(frase);

        console.log(objeto);
    }, [objeto]);

    const navegar = useNavigate();

    async function Atualizar(e) {
        e.preventDefault()
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
                //  Atualizando os dados da publicação
                const docRef = await updateDoc(doc(db, "Posts", objeto.id), {
                    titulo: titulo,
                    imagem: imagem,
                    conteudo: conteudo,
                    tags: tags
                        .split(",")
                        .map((text) => text.trim())
                        .filter((t) => {
                            if (t === "") {
                                return false;
                            } else {
                                return true;
                            }
                        }),
                })
                    .then((v) => {
                        console.log(v);
                    })
                    .catch((err) => console.log(`Ops, Não foi possível fazer a publicação. ${err}`));

                //  Resetando os campos do formulário
                setTitulo("");
                setImagem("");
                setConteudo("");
                setTags([]);

                //  Redirecionando a dashboard
                navegar("/dashboard", { state: true });
            } else {
                setErroFormulario("A imagem deve conter uma url válida");
                setTimeout(() => setErroFormulario(""), 3000);
            }
        });
    }

    return (
        <div id={estiloCriarPost.container}>
            <img src={foto} id={styles.logo} alt="ilustração de icone de edição" />
            <h2>Edição de Post</h2>
            <form onSubmit={Atualizar}>
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
                    <label>Preview:</label>
                    <img src={imagem} id={styles.preview} alt="" />
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
                <button>Salvar</button>
                <button id={styles.botao} onClick={(e)=> {
                    e.preventDefault()
                    navegar("/dashboard")
                }}>Cancelar</button>
                
                {/*Caso a senha de confirmação não coincida com a senha */}
                {erroFormulario.length > 0 ? (
                    <p style={{ color: "red", position: "absolute", marginTop: "4px", fontWeight: "600" }}>{erroFormulario}</p>
                ) : undefined}
            </form>
        </div>
    );
};

export default EditPost;
