"use strict"

const moment = require('moment'); // Formatear fechas

class DUsers{

    constructor(pool){
        this.pool = pool;
    }

    createUser(data, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                
                data.profileImg = data.profileImg || `defecto${Math.floor(Math.random() * 3) + 1}.png`;
                connection.query("INSERT INTO `users`(`email`, `name`, `password`, `profileImg`) VALUES (?, ?, ?, ?)", [ data.email, data.name, data.password, data.profileImg ], function(error, result){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(false, result);
                    }
                });
            }
        });

    }

  

    readAllUsers(callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                connection.query("SELECT id as userid, name, profileImg as img,", function(error, result){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(false, result);
                    }
                });
            }
        });
        
    }

    isUserCorrect(email, password, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT * FROM users WHERE email = ? AND password = ?" , [ email, password ], function(err, rows){
                    connection.release(); // devolver al pool la conexión
                    if (err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(rows.length === 0){
                            callback(null, null); // no está el usuario con el password proporcionado
                        }
                        else{
                            rows = rows[0];
                            console.log("Esta es la direccion de img: "+rows.user_img);
                            callback(null, { name: rows.name, email: rows.email, profileImg :rows.user_img });
                        }
                    }
                }); 
            }
        });
    }
    getUserImageName(email, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT profileImg as imageUSer FROM users WHERE email=?", [ email ], function(error, result){
                    connection.release(); // devolver al pool la conexión
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        if(result.length > 0){
                            result = result[0];
                            callback(null, result.imageUSer);
                        } else{
                            callback(null, null); // el usuario no tiene imagen
                        }
                    }
                });
            }
        });
    }

    findByFilter(text, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                let sql = "SELECT id as userid, name, profileImg as img, t FROM users u WHERE u.name LIKE ?;";
                connection.query(sql, [ text ] , function(error, results){
                    connection.release();
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        callback(false, results);
                    }
                });
            }
        });
    }

    findByID(id, callback){
        this.pool.getConnection(function(error, connection){
            if(error){
                callback(new Error("Error de conexion a la base de datos"));
            } else{
                connection.query("SELECT email FROM users WHERE id=?", [ id ] , function(error, result){
                    if(error){
                        callback(new Error("Error de acceso a la base de datos"));
                    } else{
                        let email = result[0].email;
                        let sql1 = "SELECT u.date, u.name, u.profileImg as img, FROM users u WHERE u.id=?;";
                        let sql2 = "SELECT COUNT(*) AS questions FROM questions WHERE user=?;";
                        let sql3 = "SELECT COUNT(*) AS answers FROM answers WHERE user=?;";
                        // let sql4 = "SELECT MedalType, COUNT(MedalType) as medalsNumber, MedalName FROM medals_user WHERE IdUser=? GROUP BY MedalType ORDER BY MedalType DESC";
                       // let sql4 = "SELECT MedalType as type, MedalName as name, COUNT(*) as totalCount FROM medals_user WHERE IdUser=? GROUP BY MedalName;";
                        connection.query(sql1 + sql2 + sql3  [ id, email, email ] , function(error, results){
                            connection.release();
                            if(error){
                                callback(new Error("Error de acceso a la base de datos"));
                            } else{
                                let response = { user : {}/*, medals : { Gold:[], Bronze:[], Silver:[] }*/ };
                                response.user           = results[0][0];
                                response.user.date      = moment(response.user.date).format('YYYY-MM-DD HH:mm:ss');
                                response.user.questions = results[1][0].questions;
                                response.user.answers   = results[2][0].answers;
                               /* results[3].forEach(medalPkg => {
                                    response.medals[medalPkg.type].push(medalPkg);
                                });*/
                                callback(false, response);
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = DUsers;