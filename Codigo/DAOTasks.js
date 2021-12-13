"use strict";
class DAOTasks {
    constructor(pool) {
      this.pool = pool;
    }
    /////////////////////////////////////////////////////////////////////////
    getAllTasks(email, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT task.id, task.text, task.done, CONCAT(\"[\", group_concat( tag.name separator ', ' ), \"]\") AS tags FROM user JOIN task ON  task.user = user.email  JOIN tagrels ON tagrels.taskid = task.id JOIN tag ON tag.tagID=tagrels.tagID WHERE email=? GROUP BY task.id" ,
                [email],
                function(err, result) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (result.length === 0) {
                                callback(new Error("No existen tareas asociadas al usuario")); //no está el usuario con el password proporcionado
                            }
                            else {
                                callback(null, result);
                            }
                        }
                });
            }
        }
        );
    }
    ///////////////////////////////////////////////////////////////////
    insertTask(email, task, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                connection.release()
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO task ( user, text, done) VALUES ( ?, ?, ?)" ,
                [email,task.text,task.done],
                function(err, result) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error de acceso a la base de datos: Insertar tarea"));
                        }
                        else {
                            if (result.affectedRows === 0) {
                                connection.release();
                                callback(new Error("Insertar tarea: No existe el usuario")); //no está el usuario con el password proporcionado
                            }
                            else{
                                let taskid= result.insertId;
                                for(var tag of task.tags){
                                    connection.query("INSERT INTO tag (name) VALUES (?)" ,
                                    [tag],
                                    function(err,result2) {
                                            if (err.code!='ER_DUP_ENTRY') {
                                                connection.release();
                                                callback(new Error("Error de acceso a la base de datos: Insertar tag"));
                                            }
                                            else{
                                                connection.query("SELECT tagid FROM tag WHERE tag.name=?",[tag],function(err1,res){
                                                    if(err1){
                                                        connection.release();
                                                        callback(new Error("Error de acceso a la base de datos: Buscar tagid"));
                                                    }else{
                                                        connection.query("INSERT INTO tagrels (taskId,tagId) VALUES (?,?)" ,
                                                        [taskid,res[0].tagid],
                                                        function(err) {
                                                        if (err) {
                                                            connection.release();
                                                            callback(new Error("Error de acceso a la base de datos: Insertar tagrel"));
                                                        }
                                                        });
                                                    }
                                                });
                                                
                                            }
                                    });
                                }
                                connection.release()
                                callback(null,true);
                            }
                        }
                });
            }
        }
        );
    }
    ///////////////////////////////////////////////////////////////////
    markTaskDone(idTask, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("UPDATE task SET done = 1 WHERE task.id = ?" ,
                [idTask],
                function(err, result) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (result.affectedRows === 0) {
                                callback(new Error("No existe la tarea")); //no está la tarea con el id proporcionado
                            }
                            else {
                                callback(null, true);
                            }
                        }
                });
            }
        }
        );
    }
    ///////////////////////////////////////////////////////////////////
    deleteCompleted(email, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT id FROM task WHERE task.user=? AND done=\'1\'" ,
                [email],
                function(err, result) {
                    if (err) {
                        connection.release();
                        callback(new Error("Error de acceso a la base de datos: Seleccionar tareas"));
                    }
                    else {
                        if (result.length === 0) {
                            connection.release();
                            callback(new Error("Buscar tarea: No existe el usuario")); //no está el usuario con el password proporcionado
                        }
                        else{
                            for(var tid of result){
                                connection.query("DELETE FROM tagrels WHERE tagrels.taskId=?" ,
                                [tid.id],
                                function(err) {
                                    if (err) {
                                        connection.release();
                                        callback(new Error("Error de acceso a la base de datos: Borrar tagrel"));
                                    }
                                    else{
                                        connection.query("DELETE FROM task WHERE task.id=?",[tid.id],function(err1){
                                            if(err1){
                                                connection.release();
                                                callback(new Error("Error de acceso a la base de datos: Borrar tarea"));
                                            }
                                        });
                                    }
                                });
                            }
                            connection.release();
                            callback(null,true);
                        }
                    }
                });
            }
        }
        );
    }
}
module.exports = DAOTasks;