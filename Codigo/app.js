"use strict";

//----------------------------TODOS LOS "require"s-------------------------//
//LOS FAVICONS, MORGAN Y TAL SEGURAMENTE TENDRAMOS QUE CAMBIARLO
const middlewares       = require('./middlewares');
const bodyParser        = require('body-parser');
const express           = require('express');
const path              = require('path');
const morgan            = require('morgan');
const staticFiles       = path.join(__dirname, "public");
const usersRouter       = require("./routers/routerUsers");
const questionsRouter   = require('./routers/routerQuestions');
const session           = require('express-session');
const mysqlSession      = require('express-mysql-session');
const config            = require('./config');
const MySQLStore        = mysqlSession(session);
const sessionStore      = new MySQLStore({
    host        : config.mysqlConfig.host,
    user        : config.mysqlConfig.user,
    password    : config.mysqlConfig.password,
    database    : config.mysqlConfig.database
});
const middlewareSession = session({
    saveUninitialized   : false,
    secret              : "SergioIsma",
    resave              : false,
    store               : sessionStore 
});

//-----------------------------------APP------------------------------------//

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

// Recursos estaticos
//LOS FAVICONS, MORGAN Y TAL SEGURAMENTE TENDRAMOS QUE CAMBIARLO
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));
app.use(favicon(__dirname + "/public/img/favicon.png"));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

//----------------------------------SESSION---------------------------------//


app.use(middlewareSession);

app.use(function(request, response, next) {
    console.log("request.session.currentUser ========> ", request.session.currentUser);
    next();
})

//--------------------------------- RUTAS ----------------------------------//
app.use("/users", routerUsers);
app.use("/questions", routerQuestions);
//---------------------------------MANEJADORES DE RUTAS ----------------------------------//
app.get("/", (request, response) => {
    response.redirect("/U_index");
});

app.get("/U_index", middlewares.checkSession, (request, response) => {
    response.render("U_index");
});

app.get("/imagen/:id", middlewares.checkSession, function(request, response){
    response.sendFile(path.join(__dirname, "./public/img", request.params.id));
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
//------------------------------ERRORMIDDLEWARE------------------------------//
app.use(middlewares.middlewareNotFoundError); // middleware ERROR 404
app.use(middlewares.middlewareServerError); // middleware ERROR 500

