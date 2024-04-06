//  Convertendo o tempo em segundos para formato de data
const useConverterSegundoParaData = (secs) => {
   let t = new Date(secs * 1000); // Epoch
   let dd = t.getDate();
   let mm = t.getMonth() + 1;
   let yyyy = t.getFullYear();
   let frase = `${dd < 10 ? "0" + dd : dd}/${mm < 10 && "0" + mm}/${yyyy}`;
   return frase;
};

export default useConverterSegundoParaData;
