import styles from "./Dashboard.module.css";
import { getAuth } from "firebase/auth";
import { app, db } from "../../firebase/config";
import { collection, getDocs, orderBy, query, where, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import estiloHome from "../Home/Home.module.css";
import { SiSpinrilla } from "react-icons/si";
import foto from "../../Images/user_security_token.svg";
import { useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [posts, setPosts] = useState(undefined);

    const [removido, setRemovido] = useState(false);

    const userID = getAuth(app).currentUser.uid;

    const [atualizado, setAtualizado] = useState(false);

    const navegar = useNavigate();

    //  Caso o sinal de que o post foi atualizado
    const foiAtualizado = useLocation().state;

    //  Pegando os Posts criados pelo usuário
    async function capturarPosts(uid) {
        const arr = [];
        let q = query(collection(db, "Posts"), orderBy("criadoEm", "desc"), where("uid", "==", uid));

        let captura = await getDocs(q);

        captura.forEach((doc) => {
            arr.push({ data: doc.data(), id: doc.id });
        });

        console.log(arr);
        if (arr.length > 0) {
            setPosts(arr);
        }
    }

    //  Removendo o Post criado pelo usuário
    async function removePost(postId) {
        setPosts(undefined);
        await deleteDoc(doc(db, "Posts", postId)).then((res) => {
            capturarPosts(userID);
            setRemovido(true);
            setTimeout(() => {
                setRemovido(false);
            }, 5000);
        });
    }

    useEffect(() => {
        capturarPosts(userID);
    }, [userID]);

    useEffect(() => {
        if (foiAtualizado === true || foiAtualizado === false) {
            setAtualizado(true);
            setTimeout(() => {
                setAtualizado(false);
            }, 4000);
        }
    }, [foiAtualizado]);

    return (
        <section id={styles.container}>
            <img src={foto} alt="logo de dashboard" />
            <h2>Dashboard</h2>
            <p>Gerencie os seus Posts</p>
            {/*Caso Hajam posts criados pelo administrador da conta */}
            {posts ? (
                <div id={styles.userPostsContainer}>
                    <div id={styles.linha}>
                        <p>Título</p>
                        <p>Ações</p>
                    </div>
                    {posts.map((val) => {
                        return (
                            <div id={styles.itemLine}>
                                <div id={styles.left}>
                                    <p>{val.data.titulo}</p>
                                </div>
                                <div id={styles.right}>
                                    <button
                                        onClick={() => {
                                            navegar(`/posts/${val.id}`, { state: val });
                                        }}
                                    >
                                        Ver
                                    </button>
                                    <button
                                        onClick={() => {
                                            navegar("editar", { state: val });
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        id={styles.excluir}
                                        onClick={() => {
                                            removePost(val.id);
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {/*Caso o item seja removido com sucesso */}
                    {removido === true && <p id={styles.removido}>Post removido com sucesso!</p>}
                    {/*Caso um post seja atualizado com sucesso */}
                    {atualizado === true && <p id={styles.removido}>Post atualizado com sucesso!</p>}
                </div>
            ) : (
                <SiSpinrilla id={estiloHome.loading} />
            )}
        </section>
    );
};

export default Dashboard;
