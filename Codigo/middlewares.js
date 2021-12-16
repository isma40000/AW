"use strict"

module.exports = {
    loggedCheck: function(request, response, next){
        if (request.session.currentName !== undefined && request.session.currentEmail  !== undefined && request.session.currentImg !== undefined) {
            response.locals.userName    = request.session.currentName;
            response.locals.userEmail   = request.session.currentEmail;
            response.locals.userImg     = request.session.currentImg;
            next();
        } else {
            response.redirect("/login");
        }
    },


    middlewareNotFoundError: function(request, response, next){
        response.status(404);
        response.render("error404");
    },
    
    middlewareServerError: function(error, request, response, next){
        response.status(500);
        response.render("error500");
    }
}