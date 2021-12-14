"use strict";

class modelUsers {

    constructor(pool) {
        this.pool=pool;
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
                connection.query(sql, [email,password], function(err, rows) {
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); //no está el usuario con el password proporcionado
                        }
                        else {
                            const sql = "SELECT * FROM users WHERE email = ? AND password = ? AND activo = 1";
                            connection.query(sql, [email,password], function(err, rows) {
                                connection.release(); // devolver al pool la conexión
                                if (err) {
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    if (rows.length === 0) {
                                        callback(null, true, false); //no está el usuario con el password proporcionado
                                    }
                                    else {
                                        callback(null, true, true, rows[0]);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    isUSerExist(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM users WHERE email = ?";
                connection.query(sql, [email], function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false);
                        }
                        else {
                            callback(null, true);
                        }
                    }
                });
            }
        });
    }

    insertUser(email, nombre, password, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                const sql = "INSERT INTO users (email, nombre, password) VALUES(?, ?, ?)";
                connection.query(sql, [email, nombre, password], function(err1, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err1) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false);
                        }
                        else {
                            callback(null, true);
                        }
                    }
                });
            }
        });
    }
}
module.exports = modelUsers;
