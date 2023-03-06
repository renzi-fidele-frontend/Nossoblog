import styles from "./Home.module.css";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useEffect } from "react";

const Home = () => {
    useEffect(() => {}, []);

    return (
        <section id={styles.container}>
            <div id={styles.left}>
                <h2>Veja os nossos posts mais recentes</h2>
            </div>
            <div id={styles.right}>
                <form>
                    <input type="text" name="query" id="query" placeholder="Ou busque por tags" />
                    <button>Pesquisar</button>
                </form>
                <h3>Posts em destaque</h3>
                <ul>
                    <li>
                        <a href="">Amor a primeira vista</a>
                    </li>
                    <li>
                        <a href="">Como andar de biscileta</a>
                    </li>
                    <li>
                        <a href="">Como aprender programação</a>
                    </li>
                    <li>
                        <a href="">Como será a geração de futuro</a>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default Home;
