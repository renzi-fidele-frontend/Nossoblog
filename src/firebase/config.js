// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

    // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJcS1fLGe2J6gwLamNeGzDBuyhiUwVL-M",
    authDomain: "miniblog-c5fa5.firebaseapp.com",
    projectId: "miniblog-c5fa5",
    storageBucket: "gs://miniblog-c5fa5.appspot.com",
    messagingSenderId: "370896793456",
    appId: "1:370896793456:web:790ca3f1fe3f4570b7a9b5",
};

// Inicializando o firebase
const app = initializeApp(firebaseConfig);

//  Chamando o banco de dados
const db = getFirestore(app);

//  Chamando o armazenamento em nuvem
const storage = getStorage(app);

export { app, db, storage };
