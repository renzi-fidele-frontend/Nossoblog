import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import CriarPost from "./pages/CriarPost/CriarPost";
import PostPage from "./pages/PostPage/PostPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import EditPost from "./pages/Dashboard/EditPost/EditPost";
import { useSelector } from "react-redux";
import useObservarLogin from "./hooks/useObservarLogin";
import useScrollTop from "./hooks/useScrollTop";
import Chat from "./pages/Chat/Chat";
import Perfil from "./pages/Perfil/Perfil";

function App() {
   const { user } = useSelector((state) => state.user);
   const observar = useObservarLogin();

   return (
      <Router>
         <div className="App">
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
               <Route path="/dashboard/editar" element={<EditPost />} />
               <Route path="/chat" element={user !== null ? <Chat /> : <Navigate to={"/entrar"} />} />
               <Route path="/perfil_usuario" element={user !== null ? <Perfil /> : <Navigate to={"/entrar"} />} />
            </Routes>

            <Footer />
         </div>
      </Router>
   );
}

export default App;
