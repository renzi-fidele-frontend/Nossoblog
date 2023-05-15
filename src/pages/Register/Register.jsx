import styles from "./Register.module.css";
import icon from "../../Images/register.svg";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../../firebase/config";
import { motion } from "framer-motion";

const Register = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confSenha, setConfSenha] = useState("");
    const [msgErro, setMsgErro] = useState(false);
    const [erroFirebase, setErroFirebase] = useState("");

    const auth = getAuth(app);

    //  Validando o formulário
    async function validar(e) {
        e.preventDefault();
        if (senha === confSenha) {
            //  Criando o usuário
            await createUserWithEmailAndPassword(auth, email, senha)
                .then(async (userCredential) => {
                    //  Logando após criar a conta
                    console.log("Usuário cadastrado com sucesso", userCredential.user);

                    //  Atualizando a seguir o username
                    await updateProfile(userCredential.user, { displayName: nome })
                        .then(() => {
                            console.log("Nome atualizado com sucesso!");
                        })
                        .catch((err) => {
                            let errorCode = err.code;
                            let errorMessage = err.message;
                            console.log(errorCode, errorMessage);
                        });
                })
                .catch((err) => {
                    let errorCode = err.code;
                    let errorMessage = err.message;
                    console.log(errorCode, errorMessage);
                    //  Tratando os erros do Firebase
                    if (errorMessage.includes("Password")) {
                        setErroFirebase("A sua senha deve conter pelo menos 6 caractéres!");
                    } else if (errorMessage.includes("email-already-in-use")) {
                        setErroFirebase("O email inserido já é utilizado por alguém!");
                    } else {
                        setErroFirebase("Servidor indisponível, tente mais tarde");
                    }

                    setTimeout(() => {
                        setErroFirebase("");
                    }, 3000);
                });
        } else {
            setMsgErro(true);
            setTimeout(() => {
                setMsgErro(false);
            }, 3000);
        }
    }

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            id={styles.container}
        >
            <h2>Cadastre-se para postar</h2>

            <p>Crie seu usuário e compartilhe suas histórias</p>
            <div>
                <form onSubmit={validar}>
                    <fieldset>
                        <label htmlFor="">Nome:</label>
                        <input
                            value={nome}
                            required
                            onChange={(e) => {
                                setNome(e.target.value);
                            }}
                            type="text"
                            placeholder="Nome do usuário"
                        />
                    </fieldset>
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
                    <fieldset>
                        <label htmlFor="">Confirmação de senha:</label>
                        <input
                            value={confSenha}
                            required
                            onChange={(e) => {
                                setConfSenha(e.target.value);
                            }}
                            type="password"
                            placeholder="Confirme sua senha"
                        />
                    </fieldset>
                    <button>Cadastrar</button>
                    {/*Caso a senha de confirmação não coincida com a senha */}
                    {msgErro === true ? (
                        <p style={{ color: "red", position: "absolute", marginTop: "4px", fontWeight: "600" }}>
                            A senha e a confirmação devem ser as mesmas
                        </p>
                    ) : undefined}

                    {/*Caso hava erro ao se criar a conta */}
                    {erroFirebase.length > 0 ? (
                        <p style={{ color: "red", position: "absolute", marginTop: "4px", fontWeight: "600" }}>{erroFirebase}</p>
                    ) : undefined}
                </form>
                <img src={icon} alt="icone" />
            </div>
        </motion.section>
    );
};

export default Register;
