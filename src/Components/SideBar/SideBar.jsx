import React, { useState } from "react";
import styles from "./SideBar.module.css";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const [q, setQ] = useState("");

    const navegar = useNavigate();

    //  Pesquisando pela tag em cada documento da coleção
    function pesquisar(text) {
        navegar(`/pesquisa?q=${text}`);
    }

    return (
        <section id={styles.container}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    pesquisar(q);
                }}
            >
                <input type="text" name="q" required onChange={(e) => setQ(e.target.value)} id="query" placeholder="Ou busque por tags" />
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
        </section>
    );
};

export default SideBar;
