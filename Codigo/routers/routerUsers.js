"use strict";

const middlewares   = require('../middlewares');
const express       = require('express');
const usersRouter   = express.Router();
const controller    = require('../controllers/controllerUser');
const bodyParser    = require('body-parser');
const multer     = require('multer');
const path       = require('path');
const session = require('express-session');

var storage = multer.diskStorage({
    destination: path.join(__dirname, "../public/img"),
    filename: function(req, file, callback) {
      callback(null, file.originalname);
    }
  });
  
//const upload  = multer({ dest : path.join(__dirname, "../public/img") }); // Otro codificador de forms como body-parser pero para imagenes
const upload  = multer({ storage: storage });


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

