import { Link, NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import { app } from "../../firebase/config";
import { getAuth, signOut } from "firebase/auth";
import { AuthValue } from "../../context/AuthContent";
import { HiGlobeEuropeAfrica } from "react-icons/hi2";


const NavBar = () => {
    //  Pegando o valor global do Contexto
    const { user, setUser } = AuthValue();

    const auth = getAuth(app);

    let activeStyle = {
        textDecoration: "underline",
        backgroundColor: "pink",
        transition: ".5s",
        paddingInline: "9px",
        borderRadius: "3px",
    };

    //  Função para deslogar
    async function deslogar(e) {
        e.preventDefault();
        const res = await signOut(auth)
            .then((v) => v.json())
            .then((v) => console.log(v))
            .catch((err) => console.log(`Ops, não foi possível deslogar`));
    }

    return (
        <nav id={styles.nav}>
            <NavLink to="/">
                Mini{" "}
                <span>
                    Bl
                    <HiGlobeEuropeAfrica size={25} />g
                </span>
            </NavLink>
            <ul>
                <li>
                    <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} to="/">
                        Home
                    </NavLink>
                </li>
                {/*Caso  o usuário estiver logado mostrar as opções de navagação*/}
                {user && (
                    <>
                        <li>
                            <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} to="/post/novo">
                                Criar post
                            </NavLink>
                        </li>
                        <li>
                            <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} to="/dashboard">
                                Dashboard
                            </NavLink>
                        </li>
                    </>
                )}

                <li>
                    <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} to="/sobre">
                        Sobre
                    </NavLink>
                </li>

                {/*Adicionando a opção de deslogar ao se fazer login */}
                {user && (
                    <li>
                        <Link to="/" onClick={deslogar}>
                            Deslogar
                        </Link>
                    </li>
                )}

                {/*Caso o usuário não estiver logado mostrar as opções de navegação */}
                {!user && (
                    <>
                        <li>
                            <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} to="/cadastro">
                                Cadastrar
                            </NavLink>
                        </li>
                        <li>
                            <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} to="/entrar">
                                Entrar
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;
