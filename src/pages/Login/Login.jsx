import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase/config";
import styles from "./Login.module.css";
import estilo from "../Register/Register.module.css";
import { useState } from "react";
import icon from "../../Images/undraw_secure_login_pdn4.svg";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setUser } from "../../state/user/userSlice";

const Login = () => {
   const dispatch = useDispatch();

   //  Hooks do form
   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");

   //  Mensagem de erro
   const [erroMsg, setErroMsg] = useState("");

   const auth = getAuth(app);

   //  Fazendo o login
   async function validar(e) {
      e.preventDefault();
      await signInWithEmailAndPassword(auth, email, senha).catch((err) => {
         let errorMessage = err.message;
         //  Tratando os erros do firebase
         if (errorMessage.includes("invalid-email")) {
            setErroMsg("O email inserido é inválido!");
         } else if (errorMessage.includes("wrong-password")) {
            setErroMsg("A senha está incorrecta");
         } else if (errorMessage.includes("user-not-found")) {
            setErroMsg("Este email não possui uma conta neste site!");
         } else {
            setErroMsg("O servidor está indisponível, tente mais tarde!");
         }
         setTimeout(() => {
            setErroMsg("");
         }, 4000);
      });
   }

   return (
      <motion.section initial={{ opacity: 0, scale: 0 }} transition={{ duration: 0.4 }} animate={{ opacity: 1, scale: 1 }} id={estilo.container}>
         <h2>Entrar</h2>
         <p>Faça o login para poder utilizar o sistema</p>

         <div id={styles.div}>
            <form onSubmit={validar}>
               <fieldset>
                  <label htmlFor="">Email:</label>
                  <input
                     value={email}
                     required
                     onChange={(e) => {
                        setEmail(e.target.value);
                     }}
                     type="email"
                     placeholder="Email do usuário"
                  />
               </fieldset>
               <fieldset>
                  <label htmlFor="">Senha:</label>
                  <input
                     value={senha}
                     required
                     onChange={(e) => {
                        setSenha(e.target.value);
                     }}
                     type="password"
                     placeholder="Insira sua senha"
                  />
               </fieldset>
               <button>Entrar</button>
               {/*Caso haja uma mensagem de erro */}
               {erroMsg.length > 0 && <p style={{ color: "red", position: "absolute", marginTop: "4px", fontWeight: "600" }}>{erroMsg}</p>}
            </form>
            <img id={styles.imagem} src={icon} alt="Imagem ilustrativa de login" />
         </div>
      </motion.section>
   );
};

export default Login;
