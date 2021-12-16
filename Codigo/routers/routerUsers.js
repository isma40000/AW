"use strict";

const middlewares   = require('../middlewares');
const express       = require('express');
const usersRouter   = express.Router();
const controller    = require('../controllers/controllerUser');
const bodyParser    = require('body-parser');
const multer     = require('multer');
const path       = require('path');
const upload     = multer({ dest : "../public/img" }); // Otro codificador de forms como body-parser pero para imagenes

//OPERACIONES RELACIONADAS CON USURARIO, BUSQUEDAS Y ETC

// Middlewares
usersRouter.use(middlewares.loggedCheck);

// Vistas y acciones
// usersRouter.get("/", controller.getAllUsers);
// usersRouter.get("/filter", controller.findByFilter);
// usersRouter.get("/profile/:id", controller.findByID);

/*usersRouter.use(middlewares.middlewareNotFoundError); // middleware ERROR 404
usersRouter.use(middlewares.middlewareServerError); // middleware ERROR 500*/


//OPERRACIONES RELACIONADAS CON EL LOGIN

// middleware
usersRouter.use(express.urlencoded({ extended: false }));


// Vistas
usersRouter.post("/login",controller.loginUser);
usersRouter.get("/accountCreate", controller.getRegisterRedirect);
usersRouter.get("/",middlewares.loggedCheck,controller.paginaMain);
// Forms/acciones de las vistas

usersRouter.post("/createAccount", upload.single("img"), controller.registerUser);
usersRouter.get("/logoutUser", middlewares.loggedCheck, controller.logoutUser);


usersRouter.use(middlewares.middlewareNotFoundError); // middleware ERROR 404
usersRouter.use(middlewares.middlewareServerError); // middleware ERROR 500

module.exports = usersRouter;

