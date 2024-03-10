const fs = require('fs');

const FICHERO_JSON = "tienda1.json"

const  tienda_json = fs.readFileSync(FICHERO_JSON);

const tienda = JSON.parse(tienda_json);

console.log("Usuarios registrados en la tienda: " + tienda["users"].length);
tienda["users"].forEach((element, index)=>{
    console.log("Usuario " + (index + 1) + ": " + element["name"]);
});

console.log("Productos en la tienda: " + tienda["products"].length);
tienda["products"].forEach((element, index)=>{
    console.log("Producto " + (index + 1) + ": " + element["name"]);
});

console.log("Pedidos pendientes: " + tienda["orders"].length);
tienda["orders"].forEach((element, index)=>{
  console.log("Pedido " + (index + 1) + ":" + "\n   Cliente:" + element["user"] + "\n   Cantidad:" + element["amount"]);
});