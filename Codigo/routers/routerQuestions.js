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
questionsRouter.get("/tag/:label", controller.findByTag);
questionsRouter.get("/create", controller.create);
questionsRouter.get("/search", controller.findByText);
questionsRouter.get("/:id", controller.getQuestion);
questionsRouter.get("/notAnswered", controller.getNotAnswered);

//Acciones de las vistas
questionsRouter.post("/createQuestion", controller.createQuestion);
questionsRouter.post("/publishAnswer/:id", controller.publishAnswer);

questionsRouter.use(middlewares.middlewareNotFoundError); // middleware ERROR 404
questionsRouter.use(middlewares.middlewareServerError); // middleware ERROR 500   

module.exports = questionsRouter;