const mongoose = require('mongoose');
const shortId = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validateInput = require('./../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const passwordLib = require('../libs/generatePasswordLib');
const UserModel = require('./../models/User');

/**User SignUp function. */
let signUpFunction = (req,res)=>{
    let validateUserInput = ()=>{
        return new Promise((resolve,reject)=>{
          if(req.body.email){
             if(!validateInput.email(req.body.email)){
                reject(response.generate(true,'Email does not meet the requirement.',400,null));
             }else if(check.isEmpty(req.body.password)){
                reject(response.generate(true,'"password" parameter is missign.',400,null));
             }else {
                 resolve(req);
             }
          }else{
              logger.error("Field missing during user creation.","userController(): createUser()",5);
              reject(response.generate(true,'One or more parameter(s) is missing.',400,null));
          }
        });
    }

    let createUser = ()=>{
        return new Promise((resolve,reject)=>{
           UserModel.findOne({email:req.body.email})
           .exec((err,retrievedUserDetails)=>{
              if(err){
                logger.error(err.message,'userController(): createUser',10);
                reject(response.generate(true,'Failed to create new user.',500,null));
              }else if(check.isEmpty(retrievedUserDetails)){
                let newUser = new UserModel({
                    userId: shortId.generate(),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email.toLowerCase(),
                    mobileNumber: req.body.mobileNumber,
                    password: passwordLib.hashPassword(req.body.password),
                    createdOn: time.now()
                });

                newUser.save((err, newUser)=>{
                   if(err){
                     console.log(err);
                     logger.error(err.message,'userController(): createUser', 10);
                     reject(response.generate(true,'Failed to create new user.', 500, null));
                   }else {
                       resolve(newUser.toObject());
                   }
                });
              }else{
                  logger.error('User cannot be created , User already present.','userController(): createUser', 4);
                  reject(response.generate(true,'User already present with this email.',403,null));
              }
           });
        });
    }

    validateUserInput(req,res)
    .then(createUser)
    .then((resolve)=>{
        delete resolve.password;
        res.send(response.generate(false,'User created successfully.',200, resolve));
    })
    .catch((err)=>{
       console.log(err);
       res.send(err);
    });
}

/**User Login function. */
let logInFunction = (req,res)=>{

}

/**User LogOut function. */
let logOut = (req,res)=>{

}

module.exports = {
    signUpFunction:signUpFunction,
    logInFunction:logInFunction,
    logOut:logOut
}
