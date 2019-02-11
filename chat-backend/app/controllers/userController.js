const mongoose = require('mongoose');
const shortId = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validateInput = require('./../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const passwordLib = require('../libs/generatePasswordLib');
const UserModel = require('./../models/User');
const token = require('./../libs/tokenLib');

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
   let findUser = ()=>{
       console.log('Find user');
       return new Promise((resolve,reject)=>{
          if(req.body.email){
            console.log('req body email is here.');
            console.log(req.body);
            UserModel.findOne({ email: req.body.email }, (err, userDetails)=>{
               if(err){
                 console.log(err);
                 logger.error('Failed to retrive user data.','userController: findUser()',10);
                 reject(response.generate(true,'Failed to find user details.',500,null));
               }else if(check.isEmpty(userDetails)){
                 logger.error('No user found.','userController findUser()',7);
                 reject(response.generate(true,'No user details found.',404,null));
               }else{
                 logger.info('User found.','userController findUser()',10);
                 resolve(userDetails);
               }
            });
          }else{
              reject(response.generate(true,'"email" parameter is missing.',400,null));
          }
       });
   }


   let validatePassword = (retrievedUserDetails)=>{
       console.log('validate password.');
       return new Promise((resolve,reject)=>{
          passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch)=>{
             if(err){
                 console.log(err);
                 logger.error(err.message,'userController: validateUser()',10);
                 reject(response.generate(true,'Login failed.',500,null));
             }else if(isMatch){
                let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                delete retrievedUserDetailsObj.password;
                delete retrievedUserDetailsObj._id;
                delete retrievedUserDetailsObj.__v;
                delete retrievedUserDetailsObj.createdOn;
                delete retrievedUserDetailsObj.modifiedOn;
                resolve(retrievedUserDetailsObj);
             }else{
                 logger.info('login failed due to invalid password.','userController: validatePassword()', 10);
                 reject(response.generate(true,'Wrong password login failed.', 400,null));
             }
          });
       });
   }



   let generateToken = (userDetails)=>{
      console.log('generate token');
      return new Promise((resolve,reject)=>{
        token.generateToken(userDetails, (err, tokenDetails)=>{
            if(err){
              console.log(err);
              reject(response.generate(true,'Failed to generate token.',500,null));
            }else{
                tokenDetails.userId = userDetails.userId;
                tokenDetails.userDetails = userDetails;
                resolve(tokenDetails);
            }
        });
      });
   }


   findUser(req,res)
   .then(validatePassword)
   .then(generateToken)
   .then((resolve)=>{
        res.send(false,'Login successfull.',200,resolve);
   })
   .catch((err)=>{
      console.log('err handler.');
      console.log(err);
      res.status(err.status);
      res.send(err);
   });
}

/**User LogOut function. */
let logOut = (req,res)=>{

}

module.exports = {
    signUpFunction:signUpFunction,
    logInFunction:logInFunction,
    logOut:logOut
}
