import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { render } from "react-dom"; // add this
import { Provider } from "react-redux";
import store from "./state/store";

render(
   <React.StrictMode>
      <Provider store={store}>
         <App />
      </Provider>
   </React.StrictMode>,
   document.getElementById("root")
);
