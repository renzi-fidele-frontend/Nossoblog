import { useState, useRef } from "react";
import styles from "./CriarPost.module.css";
import { db, storage } from "../../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import foto from "../../Images/postalbox.svg";
import { motion } from "framer-motion";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../node_modules/@draft-js-plugins/image/lib/plugin.css";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/draft-js/dist/Draft.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useSelector } from "react-redux";
import checkIfImageExists from "../../hooks/useCheckIfImageExists";
import load from "../../Images/ball-triangle.svg";

const CriarPost = () => {
   //  Hooks do formulário
   const [titulo, setTitulo] = useState("");
   const [imagem, setImagem] = useState("");
   const [conteudo, setConteudo] = useState("");
   const [tags, setTags] = useState("");
   const [loading, setLoading] = useState(false);
   const [erroFormulario, setErroFormulario] = useState("");
   const [editorState, seteditorState] = useState(EditorState.createEmpty());
   const [conteudoHTML, setConteudoHTML] = useState("");
   const navegar = useNavigate();
   const [imgUpload, setImgUpload] = useState(null);

   //  Pegando o valor global do Contexto
   const { user } = useSelector((state) => state.user);

   async function publicar(e) {
      e.preventDefault();
      setLoading(true);

      checkIfImageExists(imagem, async (exists) => {
         if (exists || imgUpload !== null) {
            if (imgUpload !== null) {
               let lext = `Imagens/${imgUpload.name + v4()}`;
               //  Adicionando a imagem a base de dados
               const imageRef = ref(storage, lext);

               //  Adicionando a imagem ao DB
               uploadBytes(imageRef, imgUpload).then((v) => {
                  getDownloadURL(v.ref).then(async (link) => {
                     //  Adicionando a publicação à base de dados
                     const docRef = await addDoc(collection(db, "Posts"), {
                        titulo: titulo,
                        imagem: link,
                        conteudo: conteudoHTML,
                        tags: tags.split(",").map((v) => v.trim()),
                        criadoEm: Timestamp.now(),
                        criadoPor: user.displayName,
                        uid: user.uid,
                        vezesLido: 0,
                     })
                        .then((v) => {
                           setLoading(false);
                           console.log(v);
                           //  Resetando os campos do formulário
                           setTitulo("");
                           setImagem("");
                           setConteudo("");
                           setTags([]);

                           //  Redirecionando a home
                           navegar("/");
                        })
                        .catch((err) => console.log(`Ops, Não foi possível fazer a publicação. ${err}`));
                  });
               });
            }
         } else {
            setErroFormulario("A imagem deve conter uma url válida");
            setTimeout(() => setErroFormulario(""), 3000);
         }
      });
   }

   const [estiloEditor, setEstiloEditor] = useState({ undefined });

   const inputRef = useRef();

   return (
      <motion.section initial={{ opacity: 0, scale: 0 }} transition={{ duration: 0.4 }} animate={{ opacity: 1, scale: 1 }} id={styles.container}>
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
                  placeholder="Insira uma imagem que representa o seu post"
                  ref={inputRef}
                  name="imgUrl"
                  value={imagem}
                  onChange={(e) => setImagem(e.target.value)}
               />
            </fieldset>
            <fieldset>
               <label htmlFor="conteudo">Conteúdo</label>
               <Editor
                  onFocus={() => setEstiloEditor({ backgroundColor: "pink" })}
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
                  editorStyle={estiloEditor}
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

            <button>Publicar</button>
            {/*Caso a senha de confirmação não coincida com a senha */}
            {erroFormulario.length > 0 ? (
               <p style={{ color: "red", position: "absolute", marginTop: "4px", fontWeight: "600" }}>{erroFormulario}</p>
            ) : undefined}
         </form>

         {!loading && (
            <div id={styles.loadingCt}>
               <img src={load} alt="" />
               <p>Aguarde um momento</p>
            </div>
         )}
      </motion.section>
   );
};

export default CriarPost;
