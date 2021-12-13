"use strict";

const express = require("express");
const path = require("path");
const routerUsers = express.Router();
const controllerUsers = require("../controllers/controllerUsers");
const controllerU = new controllerUsers();

routerUsers.post("/login", controllerU.login);

routerUsers.get("/", controllerU.identificacionRequerida, controllerU.pagina_user);

routerUsers.get("/registrarUser", controllerU.identificacionRequerida, controllerU.registrarUsers)

routerUsers.post("/nuevoUser", controllerU.identificacionRequerida, controllerE.nuevoUser)

module.exports = routerUsers;