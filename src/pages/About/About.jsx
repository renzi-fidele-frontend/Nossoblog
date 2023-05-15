import styles from "./About.module.css";
import { AuthValue } from "../../context/AuthContent";
import { useEffect } from "react";
import estiloHome from "../Home/Home.module.css";
import logo from "../../Images/about.svg";
import me from "../../Images/me.png";

const About = () => {
    //  Pegando o valor global do contexto
    const { user } = AuthValue();

    useEffect(() => {
        console.log(`Aqui na página sobre o valor global é: ${user}`, user);
    }, []);

    return (
        <div id={styles.container}>
            <img src={logo} alt="Logo que descreve a secção Sobre" />
            <h2>Sobre</h2>
            <div id={styles.linha}>
                <div id={styles.left}>
                    <img src={me} alt="Imagem do criador deste site" />
                </div>
                <div id={styles.right}>
                    <p>
                        Olá, eu sou um desenvolvedor de front-end e estou animado em compartilhar um pouco sobre o meu processo de criação! Minha
                        ferramenta preferida para criar aplicações web é o ReactJS, um framework poderoso e flexível que me permite construir
                        interfaces de usuário ricas e dinâmicas.
                    </p>
                    <br />
                    <p>
                        Além disso, recentemente comecei a utilizar o Firebase como plataforma de back-end para hospedar meus projetos e
                        gerenciar dados. Esta plataforma integrada me permite facilmente gerenciar usuários, autenticação, armazenamento de
                        arquivos e banco de dados em tempo real.
                    </p>
                    <br />
                    <p>
                        Para mim, a chave para criar projetos bem-sucedidos é uma combinação de criatividade, atenção aos detalhes e uma
                        abordagem iterativa. Eu gosto de começar com uma visão clara do que quero criar, mas também estou sempre aberto a ajustar
                        o meu processo de acordo com feedback e novas informações.
                    </p>
                    <br />
                    <p>
                        Estou constantemente aprendendo e evoluindo minhas habilidades, e estou animado para ver o que o futuro reserva para o
                        desenvolvimento front-end!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
