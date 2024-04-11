function useAnalisarData(segundos) {
   let dataAtual = new Date();
   let dataEnviada = new Date(segundos * 1000);

   //   Caso o tempo que passou seja equivalente a Hoje
   if (
      dataEnviada.getDate() === dataAtual.getDate() &&
      dataEnviada.getMonth() === dataAtual.getMonth() &&
      dataEnviada.getFullYear() === dataAtual.getFullYear()
   ) {
      return "Hoje";
   }

   //   Caso o tempo que passou seja equivalente a Ontem
   let ontem = new Date(dataAtual.getTime() - 24 * 60 * 60 * 1000);
   if (
      dataEnviada.getDate() === ontem.getDate() &&
      dataEnviada.getMonth() === ontem.getMonth() &&
      dataEnviada.getFullYear() === ontem.getFullYear()
   ) {
      return "Ontem";
   }

   //   Caso o tempo que passou não seja equivalente a Hoje nem a Ontem
   let opcoes = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

   return dataEnviada.toLocaleDateString("pt-br", opcoes);
}

export default useAnalisarData;
