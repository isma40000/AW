
   
"use strict";

const DAOQuestions  = require('../models/modelQuestions'); // DAOQuestions
const pool          = require("../database");
let dao             = new DAOQuestions(pool);

module.exports = {
    // Ruta: /preguntas/
    getAllQuestions : function(request, response){
        dao.readQuestions(function(error, data){
            if(error){
                response.status(500);
                response.render("error500");
            } else{
                response.render("questions", { questions: data.questions, total: data.totalQuestions, title: 'Todas las preguntas' });
            }
        });
    },

    // Ruta: GET /questions/search en el filtro del header
    findByText: function(request, response){
        dao.filterByText(`%${request.query.busqueda}%`, function(error, data){
            if(error){
                response.status(500);
                response.render("error500");
            } else{
                response.render("questions", { questions: data.questions, total: data.totalQuestions, title: `Resultados de la búsqueda "${request.query.busqueda}"` });
            }
        });
    },

    // Ruta: /questions/tag/:label
    findByTag: function(request, response){
        dao.filterByTag(request.params.label, function(error, data){
            if(error){
                response.status(500);
                response.render("error500");
            } else{
                response.render("questions", { questions: data.questions, total: data.totalQuestions, title: `Preguntas con la etiqueta [${request.params.label}]` });
            }
        });
    },

    // Ruta: /questions/create
    create: function(request, response){
        response.render("page_QuestionsCreate", { errorMsg : null });
    },

    // Ruta: POST /questions/createQuestion del FORM para crear la pregunta
    createQuestion: function(request, response){
        let labels;
        let aux = [];
        if(request.body.labels !== undefined){
            labels=request.body.labels;
        }else{labels='';}
        // labels = request.body.labels || '',
        labels = labels.split('@').filter(function(tag){
            var check;
            if(tag !== '' && !aux.includes(tag)){
                check=true;
            }else{
                check=false;
            }
            aux.push(tag);
            return check;
        });

        let params = {
            email   : request.session.currentEmail,
            title   : request.body.title,
            body    : request.body.body,
            tags    : labels
        };

        if(params.title === "" || params.body === ""){
            response.render("page_QuestionsCreate", { errorMsg : 'Rellena todos los campos obligatorios marcados con *' });
        } else{
            dao.createQuestion(params, function(error){
                if(error){
                    response.status(500);
                    response.render("error500");
                } else{
                    response.redirect("/questions");
                }
            });
        }
    },

    // Ruta: /preguntas/:id vista especifica de cada pregunta
    getQuestion: function (request, response){
        dao.filterQuestionByID({ question : request.params.id, user : request.session.currentEmail }, function(error, qData){
            if(error){
                response.status(500);
                response.render("error500");
            } else{
                response.render("page_QuestionDetails", { question: qData.question, answers: qData.answers });
            }
        });
    },

    // Ruta: /preguntas/publicarRespuesta/:id para publicar una respuesta dentro de la vista de una pregunta
    publishAnswer: function(request, response){
        let params = {
            question    : request.params.id,
            text        : request.body.a_body,
            user        : request.session.currentEmail
        };
        console.log(params);
        dao.publishAnswer(params, function(error){
            if(error){
                response.status(500);
                response.render("error500");
            } else{
                response.redirect("/preguntas");
            }
        });
    },

    // Ruta: /questions/notAnswered
    getNotAnswered: function(request, response){
        dao.getNotAnswered(function(error, data){
            if(error){
                response.status(500);
                response.render("error500");
            } else{
                response.render("questions", { questions: data.questions, total: data.questions.length, title: "Preguntas sin responder" });
            }
        });
    },
}

