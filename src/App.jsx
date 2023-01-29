import "./App.css";
import { Outlet } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import { app } from "./firebase/config";

//  Função que mapeia se a autenticação foi feita com sucesso
import { getAuth, onAuthStateChanged } from "firebase/auth";

//  Context
import { AuthProvider } from "./context/AuthContent";
import { useEffect, useState } from "react";

function App() {
    const [user, setUser] = useState(undefined);

    const auth = getAuth(app);

    useEffect(() => {
        onAuthStateChanged(auth, (usr) => {
            console.log(`Houve uma mudança de estado, ${usr}`);
            setUser(usr);
        });
    }, [auth]);

    return (
        <div className="App">
            {/*O AuthProvider serve para passar o estado do usuário globalmente pelas rotas*/}
            <AuthProvider value={{ user, setUser }}>
                <NavBar />
                <Outlet />
                <Footer />
            </AuthProvider>
        </div>
    );
}

export default App;
