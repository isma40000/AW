"use strict";

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const modelUser = require("../models/modelUser");
const modelU = new modelUser(pool);

class controllerUser 
{
    identificacionRequerida(request, response, next) 
    {
        if (request.session.currentUser !== undefined &&  request.session.currentId !== undefined ) {
            response.locals.userEmail = request.session.currentUser;
            response.locals.userId = request.session.currentId;
            next();
        } else 
        {
            response.redirect("/login");
        }
    }
    login(request, response) {
        modelU.isUserCorrect(request.body.email, request.body.password, cb_isUserCorrect);

        //result1 para comprobar email y password OK
        //result2 para comprobar usuario activo
        function cb_isUserCorrect(err, result1, result2, rows) {
            if (err) {
                next(err);
            } else {
                if (!result1) {
                    response.status(200);
                    response.render("login", {errorMsg: "Email y/o contraseña no válidos"});
                } else if (!result2) {
                    response.status(200);
                    response.render("login", {errorMsg: "Usuario no activo"});
                } else {
                    response.status(200);
                    request.session.currentUser = request.body.email;
                    response.locals.userEmail = request.body.email;
                    request.session.currentId = rows.id;
                    response.locals.userId = request.session.currentId;

                    console.log(response.locals.userType);
                    response.render("principal", {msg: null, name: rows.name});
                }
            }
        }
    }

    registrarEmpleados(request, response) {
        response.status(200);
        response.render("registrar_empleado", {errorMsg: null});
    }

    pagina_empleado(request, response) {
        response.status(200);
        response.render("pagina_empleado");
    }

    nuevoEmpleado(request, response) {
        let nombre = request.body.nombre;
        let email = request.body.email;
        let passw1 = request.body.passw1;
        let passw2 = request.body.passw2;

        var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if (emailRegex.test(email)) {
            let hasNumNombre = /\d/.test(nombre);
            if (hasNumNombre) {
                response.render("registrar_user", {errorMsg: "Error relacionado con el nombre"});
            }
            else{
              
                     
                            if (passw1 !== passw2) {
                                response.render("registrar_user", {errorMsg: "La contraseña de verificación no coincide"});
                            } else {
                                if (passw1.length < 6) {
                                    response.render("registrar_user", {errorMsg: "La contraseña no tiene la longitud necesaria"});
                                }
                                else {
                                    modelU.isUserExist(email, cb_isUserExist);

                                    function cb_isUserExist(err, result) {
                                        if (err) {
                                            response.status(500);
                                            response.render("registrar_user", {errorMsg: err.message});
                                        } else {
                                            if (!result) { //si no existia ese email en la BD
                                                modelU.insertEmpleado(email,nombre, passw1, cb_insertUser);

                                                function cb_insertUser(err1, result1) {
                                                    if (err1) {
                                                        response.status(500);
                                                        response.render("registrar_user", {errorMsg: err1.message});
                                                    } else {
                                                        if (!result1) {
                                                            response.status(200);
                                                            response.render("registrar_user", {errorMsg: "Error, inserta de nuevo"});
                                                        } else {
                                                            response.status(200);
                                                            response.render("principal", {msg: "Usuario insertado correctamente"});
                                                        }
                                                    }
                                                }
                                            } else {
                                                response.render("registrar_user", {errorMsg: "Email ya existe"});
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                }
            
        
    
    
    }
    module.exports = controllerUser;

































