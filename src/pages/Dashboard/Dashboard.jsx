import styles from "./Dashboard.module.css";
import hand from "../../Images/empty-hand.svg";
import { getAuth } from "firebase/auth";
import { app, db } from "../../firebase/config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import estiloHome from "../Home/Home.module.css";
import { SiSpinrilla } from "react-icons/si";

const Dashboard = () => {
    const [posts, setPosts] = useState(undefined);

    const userID = getAuth(app).currentUser.uid;

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

    useEffect(() => {
        capturarPosts(userID);
    }, [userID]);

    return (
        <section id={styles.container}>
            <h2>Dashboard</h2>
            <p>Gerencie os seus Posts</p>
            {/*Caso Hajam posts criados pelo administrador da conta */}
            {posts ? (
                <div id={styles.userPostsContainer}>
                    <div id={styles.linha}>
                        <p>Título</p>
                        <p>Ações</p>
                    </div>

                    <div id={styles.left}></div>
                    <div id={styles.right}></div>
                </div>
            ) : (
                <SiSpinrilla id={estiloHome.loading} />
            )}
        </section>
    );
};

export default Dashboard;
