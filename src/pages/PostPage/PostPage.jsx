import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase/config";
import styles from "./PostPage.module.css";

const PostPage = () => {
    const objecto = useLocation();

    useEffect(() => {
        console.log(objecto.state);
    }, []);

    return (
        <div id={styles.container}>
            <p>postPage</p>
        </div>
    );
};

export default PostPage;
