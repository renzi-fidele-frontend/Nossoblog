import React from "react";
import "./styles.css";

const Esqueleto = ({ tipo }) => {
   return <div className={`sk ${tipo}`}></div>;
};

export default Esqueleto;
