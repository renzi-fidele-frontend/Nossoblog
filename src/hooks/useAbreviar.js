//  Abreviando o texto passado como parametro
export function useAbreviar(str, maxlength) {
   if (str?.length > 0) {
      return str?.length > maxlength ? str?.slice(0, maxlength - 1) + "…" : str;
   }
}
