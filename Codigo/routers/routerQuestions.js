"use strict";

const middlewares       = require('../middlewares');
const express           = require('express');
const questionsRouter   = express.Router();
const controller        = require('../controllers/controllerQuestions');
const bodyParser        = require('body-parser');

// middleware
questionsRouter.use(express.urlencoded({ extended: false }));
questionsRouter.use(middlewares.loggedCheck);

// Vistas
questionsRouter.get("/", controller.getAllQuestions);
questionsRouter.get("/notAnswered", controller.getNotAnswered);
questionsRouter.get("/tag/:label", controller.findByTag);
questionsRouter.get("/create", controller.create);
questionsRouter.get("/search", controller.findByText);
questionsRouter.get("/:id", controller.getQuestion);



//Acciones de las vistas
questionsRouter.post("/createQuestion", controller.createQuestion);
questionsRouter.post("/createAnswer/:id", controller.createAnswer);
 

module.exports = questionsRouter;