import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>

        <Router>
            <Routes>
                <Route element={<App />}>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/cadastro" element={<Register />} />
                    <Route path="/entrar" element={<Login />} />
                </Route>
            </Routes>
        </Router>
    </React.StrictMode>
);
