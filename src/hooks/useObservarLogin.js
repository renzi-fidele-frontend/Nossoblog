import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { app } from "../firebase/config";
import { setUser } from "../state/user/userSlice";

const useObservarLogin = () => {
   const dispatch = useDispatch();

   const auth = getAuth(app);

   useEffect(() => {
      //  Função que mapeia se a autenticação foi feita com sucesso
      onAuthStateChanged(auth, (usr) => {
         console.log("Houve mudança de estado para", usr);

         dispatch(setUser(usr));
      });
   }, [auth]);
};

export default useObservarLogin;
