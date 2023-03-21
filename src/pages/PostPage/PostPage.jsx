import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import styles from "./PostPage.module.css";

const PostPage = () => {
    const { id } = useParams();

    async function capturarDados() {
        let docRef = doc(db, "Posts", id);
        let captura = await getDoc(docRef);

        if (captura.exists()) {
            console.log(captura.data());
        } else {
            console.log("O documento não existe.");
        }
    }

    useEffect(() => {
        capturarDados();
    }, []);

    return (
        <div id={styles.container}>
            <p>postPage</p>
        </div>
    );
};

export default PostPage;
