// Verificando se o link da imagem existe
export default function checkIfImageExists(url, callback) {
   const img = new Image();
   img.src = url;

   if (img.complete) {
      callback(true);
   } else {
      img.onload = () => {
         callback(true);
      };

      img.onerror = () => {
         callback(false);
      };
   }
}
