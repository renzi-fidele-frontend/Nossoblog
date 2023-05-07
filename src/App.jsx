import "./App.css";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import { app } from "./firebase/config";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import CriarPost from "./pages/CriarPost/CriarPost";

import { getAuth, onAuthStateChanged } from "firebase/auth";

//  Context
import { AuthProvider, AuthValue } from "./context/AuthContent";
import { useEffect, useState } from "react";
import PostPage from "./pages/PostPage/PostPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import EditPost from "./pages/Dashboard/EditPost/EditPost";

function App() {
    const [user, setUser] = useState(undefined);

    const auth = getAuth(app);

    useEffect(() => {
        //  Função que mapeia se a autenticação foi feita com sucesso
        onAuthStateChanged(auth, (usr) => {
            console.log(`Houve uma mudança de estado, ${usr}`);
            setUser(usr);
        });
    }, [auth]);

    function setUser1(val) {
        setUser(val);
    }

    return (
        <Router>
            <div className="App">
                {/*O AuthProvider serve para passar o estado do usuário globalmente pelas rotas*/}
                <AuthProvider value={{ user, setUser1 }}>
                    <NavBar />
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/sobre" element={<About />} />
                        <Route path="/cadastro" element={user === null ? <Register /> : <Navigate to={"/"} />} />
                        <Route path="/entrar" element={user === null ? <Login /> : <Navigate to={"/"} />} />
                        <Route path="/post/novo" element={user !== null ? <CriarPost /> : <Navigate replace to={"/entrar"} />} />
                        <Route path="/dashboard" element={user !== null ? <Dashboard /> : <Navigate to={"/entrar"} />} />
                        <Route path="/posts/:id" element={<PostPage />} />
                        <Route path="/pesquisa" element={<SearchPage />} />
                        <Route path="/dashboard/editar" element={<EditPost/>} />
                    </Routes>
                    <Footer />
                </AuthProvider>
            </div>
        </Router>
    );
}

export default App;
