"use strict";

const DUsers  = require('../models/modelUser'); // DUsers
const pool      = require("../database");
let daoUsers         = new DUsers(pool);

module.exports = {

    /* getLoginRedirect: function(request, response){
        response.render("page_Login", { errorMsg : null });
    },
    paginaMain: function(request, response){
        response.render("page_Main", { userImg : request.session.currentImg });
    }, */

    // Ruta: /users/createAccount POST a la bbdd del register
    registerUser: function(request, response){
        let data = {
            email       : request.body.email,
            name    : request.body.name,
            password    : request.body.password,
            password_c  : request.body.password_c,
            profileImg  : request.file
        };
        if(data.profileImg){
            data.profileImg = data.profileImg.filename // nombre del fichero, luego para obtener las imgs se hace a traves de /imagen/:id
        }
        if(data.password === data.password_c){
            if(data.name === '' || data.email === '' || data.password === '' || data.password_c === ''){
                response.render("page_AccountCreate", { errorMsg : 'Rellena todos los campos obligatorios marcados con *' });
            } else{
                daoUsers.createUser(data, function (error) {
                    if (error) {
                        response.status(500);
                        response.render("error500",{titulo:error.name, mensaje:error.message});
                    } else {
                        response.redirect("/login");
                    }
                });
            }
        } else{
            response.render("page_AccountCreate", { errorMsg : 'Las contraseñas no coinciden.' });
        }
    },

    // Ruta: /users
    loginUser: function(request, response){
        daoUsers.isUserCorrect(request.body.email, request.body.password, function(error, user){
            if(error){
                response.status(500);
                response.render("error_500",{titulo:error.name, mensaje:error.message});
            } else if(user !== null){
                request.session.currentName     = user.name;
                request.session.currentEmail    = user.email;
                request.session.currentImg      = user.profileImg;
                response.status(200);
                response.render("page_Main",{userImg : request.session.currentImg});
            } else{
                response.render("page_Login", { errorMsg : "Dirección de correo electrónico y/o contraseña no válidos" });
            }
        });
    },

    // Ruta: POST /users/logoutUser
    logoutUser: function(request, response){
        request.session.currentName==undefined;
        request.session.currentEmail==undefined;
        request.session.currentImg==undefined;
        request.session.destroy();
        response.redirect("/login");
    }
};