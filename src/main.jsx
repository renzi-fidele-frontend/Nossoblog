import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { render } from "react-dom"; // add this
render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
