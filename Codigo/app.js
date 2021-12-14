"use strict";

//----------------------------TODOS LOS "require"s-------------------------//
//LOS FAVICONS, MORGAN Y TAL SEGURAMENTE TENDRAMOS QUE CAMBIARLO
const config = require("./config");
const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const morgan = require("morgan");//
const bodyParser = require("body-parser");
const routerEmpleados = require("./routers/routerUsers");
const routerClientes = require("./routers/routerQuestions");
//const routerVehiculos = require("./routers/routerVehiculos");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");

//-----------------------------------APP------------------------------------//

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Recursos estaticos
//LOS FAVICONS, MORGAN Y TAL SEGURAMENTE TENDRAMOS QUE CAMBIARLO
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));
app.use(favicon(__dirname + "/public/img/favicon.png"));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

//----------------------------------SESSION---------------------------------//

const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);

const middlewareSession = session({
    saveUninitialized: true,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});
app.use(middlewareSession);

app.use(function(request, response, next) {
    console.log("request.session.currentUser ========> ", request.session.currentUser);
    next();
})

//--------------------------------- RUTAS ----------------------------------//
app.use("/users", routerUsers);
app.use("/questions", routerQuestions);
//app.use("/vehiculos", routerVehiculos);

//----------------------------------LOGIN-----------------------------------//

app.get("/", function (request, response) {
    response.status(200);
    response.redirect("/login");
});

app.get("/login", function (request, response) {
    response.status(200);
    response.render("login", { errorMsg: null });
});

app.get("/principal", function (request, response) {
    response.status(200);
    console.log(request.session.currentType);
    response.render("principal",{msg: null, name: null, userType: request.session.currentType});
});

//----------------------------------LOGOUT-----------------------------------//

app.get("/logout", function (request, response) {
    response.status(200);
    request.session.destroy();
    response.render("login", { errorMsg: null });
});


//------------------------------ERRORMIDDLEWARE------------------------------//

app.use(function(request, response, next) {
    response.status(404);
    response.render("error404", { url: request.url });
});

app.use(function(error, request, response, next) {
    response.status(500);
    response.render("error500", {mensaje: error.message, pila: error.stack });
});

//---------------------------------SERVIDOR---------------------------------//

app.listen(config.port, function(err) {
   if (err) {
       console.log("ERROR al iniciar el servidor");
   }
   else {
       console.log(`Servidor arrancado en el puerto ${config.port}`);
   }
});