import React, { useEffect, useRef, useState } from "react";
import styles from "./EditPost.module.css";
import estiloCriarPost from "../../CriarPost/CriarPost.module.css";
import foto from "../../../Images/ftkedit.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { db, storage } from "../../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const EditPost = () => {
    const objeto = useLocation().state;
    const [titulo, setTitulo] = useState("");
    const [imagem, setImagem] = useState("");
    const [tags, setTags] = useState("");
    const [erroFormulario, setErroFormulario] = useState("");
    const [editorState, seteditorState] = useState(EditorState.createEmpty());
    const [conteudoHTML, setConteudoHTML] = useState("");
    const [imgUpload, setImgUpload] = useState(null);
    const inputRef = useRef();

    useEffect(() => {
        setTitulo(objeto.data.titulo);
        setImagem(objeto.data.imagem);
        setConteudoHTML(objeto.data.conteudo);
        let conteudoPuro = htmlToDraft(objeto.data.conteudo);
        let contentState = ContentState.createFromBlockArray(conteudoPuro);
        let _editorState = EditorState.createWithContent(contentState);

        seteditorState(_editorState);

        let frase = "";
        objeto.data.tags.map((v) => {
            frase += v + ", ";
        });

        setTags(frase);

        console.log(objeto);
    }, [objeto]);

    const navegar = useNavigate();

    async function Atualizar(e) {
        e.preventDefault();
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
            if (exists || imgUpload !== null) {
                if (imgUpload !== null) {
                    let lext = `Imagens/${imgUpload.name + v4()}`;
                    //  Adicionando a imagem a base de dados
                    const imageRef = ref(storage, lext);

                    //  Adicionando a imagem ao DB
                    uploadBytes(imageRef, imgUpload).then((v) => {
                        getDownloadURL(v.ref).then(async (link) => {
                            //  Atualizando os dados da publicação
                            const docRef = await updateDoc(doc(db, "Posts", objeto.id), {
                                titulo: titulo,
                                imagem: link,
                                conteudo: conteudoHTML,
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
                                .then(() => {
                                    //  Resetando os campos do formulário
                                    setTitulo("");
                                    setImagem("");
                                    setConteudoHTML("");
                                    setTags([]);
                                    //  Redirecionando a dashboard
                                    navegar("/dashboard", { state: true });
                                })
                                .catch((err) => console.log(`Ops, Não foi possível fazer a publicação. ${err}`));
                        });
                    });
                } else {
                    //  Atualizando os dados da publicação
                    const docRef = await updateDoc(doc(db, "Posts", objeto.id), {
                        titulo: titulo,
                        imagem: imagem,
                        conteudo: conteudoHTML,
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
                        .then(() => {
                            //  Resetando os campos do formulário
                            setTitulo("");
                            setImagem("");
                            setConteudoHTML("");
                            setTags([]);
                            //  Redirecionando a dashboard
                            navegar("/dashboard", { state: true });
                        })
                        .catch((err) => console.log(`Ops, Não foi possível fazer a publicação. ${err}`));
                }
            } else {
                setErroFormulario("A imagem deve conter uma url válida");
                setTimeout(() => setErroFormulario(""), 3000);
            }
        });
    }

    const [estiloEditor, setEstiloEditor] = useState({ backgroundColor: "initial" });

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
                        type="file"
                        name=""
                        id="imagem"
                        accept="image/*"
                        onChange={(e) => {
                            setImgUpload(e.target.files[0]);
                            inputRef.current.disabled = true;
                        }}
                    />

                    <input
                        type="text"
                        ref={inputRef}
                        placeholder="Insira uma imagem que representa o seu post"
                        name="imgUrl"
                        value={imagem}
                        onChange={(e) => setImagem(e.target.value)}
                    />
                </fieldset>
                <fieldset>
                    <label>Preview:</label>
                    <img src={imagem} id={styles.preview} alt="" />
                </fieldset>
                <fieldset>
                    <label htmlFor="conteudo">Conteúdo</label>
                    <Editor
                        /*handleReturn={(e) => {
                            if (e.shiftKey) {
                                seteditorState(RichUtils.insertSoftNewline(editorState));
                                return "handled";
                            }
                            return "not-handled";
                        }}*/
                        onFocus={() => setEstiloEditor({ backgroundColor: "pink" })}
                        editorStyle={estiloEditor}
                        toolbarStyle={{
                            background: "rgb(179, 140, 171)",
                            border: "none",
                        }}
                        placeholder="Insira o conteúdo do post"
                        toolbar={{
                            options: ["inline", "blockType", "fontSize", "list", "textAlign", "embedded", "image"],
                            inline: {
                                options: ["bold", "italic", "underline"],
                            },
                            list: { options: ["unordered", "ordered"] },
                            fontSize: { options: [10, 12, 14, 16, 18, 24, 30] },
                        }}
                        editorState={editorState}
                        onEditorStateChange={(newState) => {
                            seteditorState(newState);
                            setConteudoHTML(draftToHtml(convertToRaw(newState.getCurrentContent())));
                            console.log(conteudoHTML);
                        }}
                        wrapperClassName={styles.demoWrapper}
                        editorClassName={styles.demoEditor}
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
                <button
                    id={styles.botao}
                    onClick={(e) => {
                        e.preventDefault();
                        navegar("/dashboard");
                    }}
                >
                    Cancelar
                </button>

                {/*Caso a senha de confirmação não coincida com a senha */}
                {erroFormulario.length > 0 ? (
                    <p style={{ color: "red", position: "absolute", marginTop: "4px", fontWeight: "600" }}>{erroFormulario}</p>
                ) : undefined}
            </form>
        </div>
    );
};

export default EditPost;
