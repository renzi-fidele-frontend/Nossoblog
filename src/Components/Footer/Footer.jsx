import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer id={styles.footer}>
            <p>
                <span>Nosso Blog</span> © Copyright 2024
            </p>
            <div>
                <p>Desenvolvedor: </p>
                <a href="https://portfolio-renzi.vercel.app">Renzi Fidele</a>
            </div>
        </footer>
    );
};

export default Footer;
