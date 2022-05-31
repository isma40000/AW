
   
"use strict";

const DAOQuestions  = require('../models/modelQuestions'); // DAOQuestions
const pool          = require("../database");
let dao             = new DAOQuestions(pool);

module.exports = {
    // Ruta: /questions/
    getAllQuestions : function(request, response){
        console.log("He llegado a getAllQuestions");
        dao.readQuestions(function(error, data){
            if(error){
                console.log(error);
                response.status(500);
                response.render("error500",{titulo:error.name, mensaje:error.message});
            } else{
                response.render("page_QuestionsAll", { questions: data.questions, n_questions: data.totalQuestions, title: 'Todas las preguntas' });
            }
        });
    },

    // Ruta: GET /questions/search en el filtro del header
    findByText: function(request, response){
        dao.filterByText(`%${request.query.desiredText}%`, function(error, data){
            if(error){
                response.status(500);
                response.render("error500",{titulo:error.name, mensaje:error.message});
            } else{
                response.render("page_QuestionsAll", { questions: data.questions, n_questions: data.totalQuestions, title: `Resultados de la búsqueda "${request.query.desiredText}"` });
            }
        });
    },

    // Ruta: /questions/tag/:label
    findByTag: function(request, response){
        dao.filterByTag(request.params.label, function(error, data){
            if(error){
                response.status(500);
                response.render("error500",{titulo:error.name, mensaje:error.message});
            } else{
                response.render("page_QuestionsAll", { questions: data.questions, n_questions: data.totalQuestions, title: `Preguntas con la etiqueta [${request.params.label}]` });
            }
        });
    },

    // Ruta: /questions/create
    create: function(request, response){
        response.render("page_QuestionsCreate", { errorMsg : null });
    },

    // Ruta: POST /questions/createQuestion del FORM para crear la pregunta
    createQuestion: function(request, response){
        let tags;
        let aux = [];
        if(request.body.tags !== undefined){
            tags=request.body.tags;
        }else{tags='';}
        // labels = request.body.labels || '',
        tags = tags.split('@').filter(function(tag){
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
            body    : request.body.bodyArea,
            tags    : tags
        };

        if(params.title === "" || params.body === ""){
            response.render("page_QuestionsCreate", { errorMsg : 'Rellena todos los campos obligatorios marcados con *' });
        } else{
            dao.createQuestion(params, function(error){
                if(error){
                    response.status(500);
                    response.render("error500",{titulo:error.name, mensaje:error.message});
                } else{
                    response.redirect("/questions");
                }
            });
        }
    },

    // Ruta: /questions/:id vista especifica de cada pregunta
    getQuestion: function (request, response){
        dao.filterQuestionByID({ question : request.params.id, user : request.session.currentEmail }, function(error, qData){
            if(error){
                response.status(500);
                response.render("error500",{titulo:error.name, mensaje:error.message});
            } else{
                response.render("page_QuestionDetails", { question: qData.question, answers: qData.answers });
            }
        });
    },

    // Ruta: /questions/publicarRespuesta/:id para publicar una respuesta dentro de la vista de una pregunta
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
                response.render("error500",{titulo:error.name, mensaje:error.message});
            } else{
                response.redirect("/questions");
            }
        });
    },

    // Ruta: /questions/notAnswered
    getNotAnswered: function(request, response){
        console.log("He llegado al controlador de preguntas")
        dao.getNotAnswered(function(error, data){
            if(error){
                response.status(500);
                response.render("error500",{titulo:error.name, mensaje:error.message});
            } else{
                response.render("page_QuestionsAll", { questions: data.questions, n_questions: data.questions.length, title: "Preguntas sin responder" });
            }
        });
    },
}

