const mongoose = require('mongoose');
const Auth = require('./../models/Auth');
const logger = require('./../libs/loggerLib');
const response = require('./../libs/responseLib');
const token = require('./../libs/tokenLib');
const check = require('./../libs/checkLib');

let isAuthorized = (req, res, next)=>{
    if(req.params.authToken ||
        req.body.authToken ||
        req.header('authToken') ||
        req.query.authToken){
            Auth.findOne({ authToken: req.header('authToken') ||
            req.params.authToken || req.body.authToken || req.query.authToken
           } , (err, authDetails)=>{
             if(err){
               console.log(err);
               logger.error(err.message,'Authorization middleware.', 10);
               res.send(response.generate(true,'Failed to authorized.', 500, null));
             }else if(check.isEmpty(authDetails)){
               logger.error('No authorizationkey is present.', 'Authorization middleware.', 10);
               res.send(response.generate(true,'Invalid or expired authorization key.', 404, null));
             }else{
                
                 token.verifyClaim(authDetails.authToken, authDetails.tokenSecret, (err, decoded)=>{
                    
                   if(err){
                     logger.error(err.message, 'Authorization middleware.', 10);
                     res.send(response.generate(true, 'Failed to authorized while verify token.', 500, null));
                   }else{
                       req.user = { userId: decoded.data.userId };
                        
                       next();
                   }
                 });
             }
           })

    }else{
        logger.error('AuthorizationToken missing.', 'Authorization middleware.', 5);
        res.send(response.generate(true, 'Authorization token is missing in request.', 400, null));
    }
}

module.exports = {
    isAuthorized:isAuthorized
}