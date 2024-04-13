function useConverterSegundoParaFormatoDeHora(secs) {
   let t = new Date(secs * 1000); // Epoch
   let hora = t.getHours();
   let minutos = t.getMinutes();
   let frase = `${hora < 10 ? 0 : ""}${hora}:${minutos < 10 ? 0 : ""}${minutos}`;
   return frase;
}

export default useConverterSegundoParaFormatoDeHora;
