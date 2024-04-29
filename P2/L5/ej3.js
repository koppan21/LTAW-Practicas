const fs = require('fs');

const FICHERO_JSON = "tienda.json"
const FICHERO_JSON_OUT = "tienda_ej3.json"

const  tienda_json = fs.readFileSync(FICHERO_JSON);

const tienda = JSON.parse(tienda_json);

tienda["products"].forEach((element, index)=>{
    element["stock"] += 1;
    console.log("Producto " + (index + 1) + ": " + element["name"] + "\n Stock: " + element["stock"]);
})

let myJSON = JSON.stringify(tienda);
fs.writeFileSync(FICHERO_JSON_OUT, myJSON);

console.log("Información guardada en fichero: " + FICHERO_JSON_OUT);