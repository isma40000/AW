"use strict";

const middlewares   = require('../middlewares');
const express       = require('express');
const usersRouter   = express.Router();
const controller    = require('../controllers/controllerUser');
const bodyParser    = require('body-parser');
const multer     = require('multer');
const path       = require('path');
const session = require('express-session');
const upload     = multer({ dest : path.join(__dirname, "../public/img") }); // Otro codificador de forms como body-parser pero para imagenes

//OPERACIONES RELACIONADAS CON USURARIO, BUSQUEDAS Y ETC

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
usersRouter.post("/",controller.loginUser);
//usersRouter.post("/login",controller.loginUser);
usersRouter.get("/accountCreate", (request,response)=>{console.log("Estoy en /users/accountCreate");response.render("page_AccountCreate", { userImg:null,errorMsg : null })});
// Forms/acciones de las vistas

usersRouter.post("/createAccount", upload.single("img"), controller.registerUser);
usersRouter.get("/logoutUser", middlewares.loggedCheck, controller.logoutUser);




module.exports = usersRouter;

