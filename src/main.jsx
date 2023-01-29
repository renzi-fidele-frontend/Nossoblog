import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import CriarPost from "./pages/CriarPost/CriarPost";
import { AuthValue } from "./context/AuthContent";
import { useEffect } from "react";

const user = () => {
    //  Pegando o valor global do Contexto
    const { user } = AuthValue();

    useEffect(() => {
        console.log(user);
    }, []);

    return user;
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route element={<App />}>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/cadastro" element={<Register />} />
                    <Route path="/entrar" element={<Login />} />
                    <Route path="/post/novo" element={<CriarPost />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </Router>
    </React.StrictMode>
);
