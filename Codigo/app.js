"use strict";

//----------------------------TODOS LOS "require"s-------------------------//
//LOS FAVICONS, MORGAN Y TAL SEGURAMENTE TENDRAMOS QUE CAMBIARLO
const middlewares       = require('./middlewares');
const bodyParser        = require('body-parser');
const express           = require('express');
const path              = require('path');
const morgan            = require('morgan');
const staticFiles       = "./public";
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
app.set("views", "./public/views");
// Recursos estaticos
//LOS FAVICONS, MORGAN Y TAL SEGURAMENTE TENDRAMOS QUE CAMBIARLO
app.use(express.static(staticFiles));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

//----------------------------------SESSION---------------------------------//


app.use(middlewareSession);

// app.use(function(request, response, next) {
//     console.log("request.session.currentUser ========> ", request.session.currentUser);
//     next();
// })

//--------------------------------- RUTAS ----------------------------------//
app.use("/users", usersRouter);
app.use("/questions", questionsRouter);
//---------------------------------MANEJADORES DE RUTAS ----------------------------------//
app.get("/", (request, response) => {
    response.status(200);
    response.redirect("/page_Main");
});

app.get("/login", (request, response) => {
    console.log("Estoy en app.js /login");
    response.status(200);
    request.session.destroy();
    response.render("page_Login",{userImg : null});
});

app.get("/page_Main", middlewares.loggedCheck, (request, response) => {
    response.status(200);
    response.render("page_Main",{userImg : request.session.currentImg});
});

app.get("/imagen/:id", middlewares.loggedCheck, function(request, response){
    response.sendFile(path.join(__dirname, "/public/img/", request.params.id));
});

app.get("/logout", function (request, response) {
    response.status(200);
    request.session.destroy();
    response.render("page_Login", { errorMsg: null });
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
//app.use(middlewares.middlewareNotFoundError); // middleware ERROR 404
//app.use(middlewares.middlewareServerError); // middleware ERROR 500

