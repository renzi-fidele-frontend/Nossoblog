export default function capitalizar(str) {
   let modStr = str !== undefined && str[0]?.toUpperCase() + str?.slice(1);
   return modStr;
}
