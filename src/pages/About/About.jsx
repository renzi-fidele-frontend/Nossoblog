import styles from "./About.module.css";
import { AuthValue } from "../../context/AuthContent";
import { useEffect } from "react";

const About = () => {
    //  Pegando o valor global do contexto
    const { user } = AuthValue();

    useEffect(() => {
        console.log(`Aqui na página sobre o valor global é: ${user}`, user);
    }, []);

    return <div>About</div>;
};

export default About;
