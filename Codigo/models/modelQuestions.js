"use strict"

const moment = require('moment'); // Formatear fechas

class DAOQuestions{

    constructor(pool){
        this.pool = pool;
    }

    // Ordenar un array de preguntas por FECHA mas reciente
    static orderQuestions(arr){
        let response = arr;
        response.sort(function(a, b){
            if(a.q_date > b.q_date){
                return -1;
            } if(a.q_date < b.q_date){
                return 1;
            }
            return 0;
        });
        return response;
    }

    createQuestion(data, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                connection.query("INSERT INTO questions(`user_email`, `title`, `q_body`) VALUES (?,?,?)", [ data.email, data.title, data.body ] , function(error, result){
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        var questionID = result.insertId;
                        if(data.tags.length > 0){
                            let param;
                            for(var i = 0; i < data.tags.length; i++){
                                param=data.tags[1];
                                //params.push([ questionID, data.tags[i] ]);
                                connection.query("SELECT name FROM tags WHERE name=?", [ param ], function(error,res1){
                                    connection.release();
                                    if(error){
                                        console.log(error);
                                        callback(new Error("Error de acceso a la base de datos tags"));
                                    } else{
                                        if(res1.length === 0){
                                            connection.query("INSERT INTO tags (name) VALUES ?;", [ param ], function(error){
                                                connection.release();
                                                if(error){
                                                    console.log(error);
                                                    callback(new Error("Error de acceso a la base de datos tags"));
                                                }
                                            });
                                        }  
                                    }
                                })
                                connection.query("INSERT INTO tags_questions (tag_name,question_id) VALUES ?,?;", [ param,questionID], function(error){
                                    connection.release();
                                    if(error){
                                        console.log(error);
                                        callback(new Error("Error de acceso a la base de datos tags"));
                                    }
                                    else{
                                        callback(null);
                                    }
                                }); 
                            }
                        } else {
                            connection.release();
                            callback(null);
                        }
                    }
                });
            }
        });
    }

    
    // ORDENARLAS CRONOLOGICAMENTE
    readQuestions(callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql1 = "SELECT q.question_id, q.user_email, q.title, q.q_body, q.q_date, u.name, u.user_img as userImg, u.email as userID FROM questions q JOIN users u ON q.user_email=u.email WHERE q.user_email=u.email;";
                let sql2 = "SELECT t.name, q.question_id FROM tags t JOIN tags_questions tq ON tq.tag_name = t.name JOIN questions q ON tq.question_id = q.question_id;";
                let sql = sql1 + sql2;
                connection.query(sql, function(error, results, fields){
                    connection.release();
                    if(error){
                        callback(error);
                    } else{
                        let questions   = {},
                            response    = [];
                        // Formateamos nuestro objeto
                        results[0].forEach(function(question){
                            question.tags = [];
                            question.q_date = moment(question.q_date).format('YYYY-MM-DD HH:mm:ss');                        
                            // if(question.body.length > 150){
                            //     question.body = question.body.slice(0, 150) + '...';
                            // }
                            questions[question.question_id] = question;
                        });
                        results[1].forEach(function(tag){
                            questions[tag.question_id].tags.push(tag.name);
                        });
                        
                        // Formateamos la salida
                        for (const [ k, v ] of Object.entries(questions)) {
                            response.push(v);
                        }
                        
                        response = DAOQuestions.orderQuestions(response);

                        callback(false, { totalQuestions: response.length, questions: response });
                    }
                });
            }
        });
    }

    filterByTag(tagName, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                
                let sql1 = "SELECT q.question_id FROM questions q JOIN tags_questions tq ON  q.question_id=tq.question_id JOIN tags t ON tq.tag_name = t.name WHERE t.name=?;";
                let sql2 = "SELECT q.question_id, q.user_email, q.title, q.q_body, q.q_date, u.name, u.user_img as userImg, u.email as userID FROM questions q JOIN users u WHERE q.user_email=u.email ORDER BY q.q_date DESC;";
                let sql3 = "SELECT t.name, q.question_id FROM tags t JOIN tags_questions tq ON tq.tag_name = t.name JOIN questions q ON tq.question_id = q.question_id;";
                let sql = sql1 + sql2 + sql3;
                connection.query(sql, [ tagName ] , function(error, results){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        let tags        = {}, // todos los tags de cada pregunta
                            response    = []; // todas las preguntas
                        results[0].forEach(function(tag){
                            tags[tag.question_id] = [];
                        });
                        results[2].forEach(function(tag){
                            if(tags[tag.question_id]){
                                tags[tag.question_id].push(tag.name);
                            }
                        });
                        results[1].forEach(function(question){
                            if(tags[question.question_id]){
                                question.q_date = moment(question.q_date).format('YYYY-MM-DD HH:mm:ss');
                                question.tags = tags[question.question_id];
                                // if(question.q_body.length > 150){
                                //     question.q_body = question.body.slice(0, 150) + '...';
                                // }
                                response.push(question);
                            }
                        });

                        callback(false, { totalQuestions: response.length, questions: DAOQuestions.orderQuestions(response) });
                    }
                });
            }
        });

    }

    filterByText(text, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql1 = "SELECT q.question_id, q.user_email, q.title, q.q_body, q.q_date, u.name, u.user_img as userImg, u.email as userID FROM questions q JOIN users u WHERE q.user_email=u.email AND (q.title LIKE ? OR q.q_body LIKE ?);";
                let sql2 = "SELECT t.name, q.question_id FROM tags t JOIN tags_questions tq ON tq.tag_name = t.name JOIN questions q ON tq.question_id = q.question_id;";
                let sql = sql1 + sql2;
                connection.query(sql, [ text, text ] , function(error, results){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        let questions   = {},
                            response    = [];
                        // Formateamos nuestro objeto
                        results[0].forEach(function(question){
                            question.tags = [];
                            question.q_date = moment(question.q_date).format('YYYY-MM-DD HH:mm:ss');
                            // if(question.body.length > 150){
                            //     question.body = question.body.slice(0, 150) + '...';
                            // }
                            questions[question.question_id] = question;
                        });
                        results[1].forEach(function(tag){
                            if(questions[tag.question_id]){
                                questions[tag.question_id].tags.push(tag.name);
                            }
                        });
                        
                        // Formateamos la salida
                        for (const [ k, v ] of Object.entries(questions)) {
                            response.push(v);
                        }
                        // console.log(response);
                        callback(false, { totalQuestions: response.length, questions: DAOQuestions.orderQuestions(response) });
                    }
                });
            }
        });
    }

    // INCREMENTAR EN 1 EL NUMERO DE VISITAS A LA PREGUNTA PARA EL USUARIO ACTUAL SI NO LA HA VISITADO ANTES
    filterQuestionByID(params, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                connection.query("SELECT COUNT(*) as filas FROM visits v WHERE v.question=? AND v.user=?", [ params.question, params.user ], function(error, results){
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        // console.log(results);
                        let sql1 = '', sql2 = '', sql3 = '', queryParams = [];
                        sql1 = "SELECT q.question_id as qID, q.title, q.q_body, q.q_date, u.email as qUserID, u.user_img, u.name FROM questions q JOIN users u WHERE q.user_email=u.email AND q.question_id=?;";
                        sql2 = "SELECT t.name FROM tags t JOIN tags_questions tq ON t.name=tq.tag_name WHERE tq.question_id=?;";
                        sql3 = "SELECT a.answer_id as aID, u.name as aUser, a.a_body, a.a_date, u.email as userID, u.user_img FROM answers a JOIN users u WHERE a.user_email=u.email AND a.question_id=?;";
                        queryParams.push(params.question, params.question, params.question);

                        connection.query(sql1 + sql2 + sql3, queryParams, function(error, results){
                            connection.release();
                            if(error){
                                callback(new Error("Error de acceso a la base de datos"));
                            } else{
                                let total = results.length;
                                let q = results[0];
                                q.tags = [];
                                q.q_date = moment(q.q_date).format('YYYY-MM-DD HH:mm:ss');
                                results[1].forEach(function(tag){ q.tags.push(tag.name); });
                                results[2].forEach(function(answer){ answer.a_date = moment(answer.a_date).format('YYYY-MM-DD HH:mm:ss'); });
                                callback(null, { question: q, answers: results[total - 1] });
                            }
                        });
                    }
                });
            }
        });
    }
    
    publishAnswer(params, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{               
                connection.query("INSERT INTO answers(user_email, question_id, a_body) VALUES (?,?,?)", [ params.user, params.question, params.text ], function(error, results){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(null);
                    }
                });
            }
        });
    }

    getNotAnswered(callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                console.log("Modelo preguntas: getNotAnswered")
                let sql0 = "SELECT DISTINCT(question_id) FROM answers";
                let sql1 = "SELECT q.question_id, q.user_email, q.title, q.q_body, q.q_date, u.name, u.user_img as userImg, u.email as userID FROM questions q JOIN users u WHERE q.user_email=u.email AND q.question_id NOT IN ("+sql0+");";
                let sql2 = "SELECT t.name, q.question_id FROM tags t JOIN tags_questions tq ON tq.tag_name = t.name JOIN questions q ON tq.question_id = q.question_id;";
                connection.query(sql1 + sql2, function(error, results, fields){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos:"+error));
                    } else{
                        let questions   = {},
                            response    = [];
                        // Formateamos nuestro objeto
                        results[0].forEach(function(question){
                            question.tags = [];
                            question.q_date = moment(question.q_date).format('YYYY-MM-DD HH:mm:ss');
                            // if(question.q_body.length > 150){
                            //     question.q_body = question.q_body.slice(0, 150) + '...';
                            // }
                            questions[question.question_id] = question;
                        });
                        results[1].forEach(function(tag){
                            if(questions[tag.question_id]){
                                questions[tag.question_id].tags.push(tag.name);
                            }
                        });
                        
                        // Formateamos la salida
                        for (const [ k, v ] of Object.entries(questions)) {
                            response.push(v);
                        }
                        response = DAOQuestions.orderQuestions(response);
                        callback(false, { totalQuestions: response.length, questions: response });
                    }
                });
            }
        });
    }
    
}

module.exports = DAOQuestions;

