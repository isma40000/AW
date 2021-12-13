// app.js
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Crear un servidor Express.js
const app = express();
// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);
// Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);
app.use(express.static('public'));
// Arrancar el servidor
app.listen(config.port, function(err) {
 if (err) {
 console.log("ERROR al iniciar el servidor");
 }
 else {
 console.log(`Servidor arrancado en el puerto ${config.port}`);
 }
});
app.get("/", function(request,response){
    response.statusCode = 200;
    response.setHeader("Content-Type","text/html");
    response.write("Esta es la pagina raiz");
    response.end();
});
app.get("/", function(request,response){
    response.statusCode = 200;
    response.type("text/plain; charset=utf-8");
    response.end("Esta es la pagina raiz");
});
app.get("/users.html", function(request,response){
    response.statusCode = 200;
    response.type("text/plain; charset=utf-8");
    response.end("Aquí se mostrará la página de usuarios");
});
app.get("/usuarios.html", function(request,response){
    response.redirect("/users.html");
});
app.listen(config.port, function(err) {
    if (err) {
    console.log("ERROR al iniciar el servidor: " + err.message);
    }
    else {
    console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
   });