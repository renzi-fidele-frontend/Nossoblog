const useOrganizarTags = (tags) => {
   //  Orgazizando as tags a mostrar
   var frase = "";
   tags.forEach((v) => {
      frase += `#${v} `;
   });
   return frase;
};

export default useOrganizarTags;
