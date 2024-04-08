function useAnalisarData(segundos) {
   let dataAtual = new Date();
   let milisegundos = segundos * 1000;
   let tempoPassado = new Date(dataAtual.getTime() - milisegundos);

   //   Caso o tempo que passou é equivalente a Hoje
   if (
      tempoPassado.getDate() === dataAtual.getDate() &&
      tempoPassado.getMonth() === dataAtual.getMonth() &&
      tempoPassado.getFullYear() === dataAtual.getFullYear()
   ) {
      return "Hoje";
   }

   //   Caso o tempo que passou é equivalente a Ontem
   let ontem = new Date(dataAtual.getTime() - 24 * 60 * 60 * 1000);
   if (
      tempoPassado.getDate() === ontem.getDate() &&
      tempoPassado.getMonth() === ontem.getMonth() &&
      tempoPassado.getFullYear() === ontem.getFullYear()
   ) {
      return "Ontem";
   }

   //   Caso o tempo que passou não seja equivalente a Hoje nem a Ontem
   let opcoes = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

   return tempoPassado.toLocaleDateString("pt-br", opcoes);
}

export default useAnalisarData;
