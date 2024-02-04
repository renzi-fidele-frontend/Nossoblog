import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useScrollTop({ divRef }) {
   const location = useLocation();

   useEffect(() => {
      divRef?.scrollTo({
         top: 0,
         behavior: "smooth",
      });
      console.log("Scroll ao topo feito", location.pathname);
   }, [location.pathname]);
}

export default useScrollTop;
