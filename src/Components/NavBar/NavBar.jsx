import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
    let activeStyle = {
        textDecoration: "underline",
        backgroundColor: "pink",
        transition: ".5s",
        paddingInline: "9px",
        borderRadius: "3px",
    };

    return (
        <nav id={styles.nav}>
            <NavLink to="/">
                Mini <span>Blog</span>
            </NavLink>
            <ul>
                <li>
                    <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} to="/">
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink style={({ isActive }) => (isActive ? activeStyle : undefined)} to="/sobre">
                        Sobre
                    </NavLink>
                </li>
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
            </ul>
        </nav>
    );
};

export default NavBar;
