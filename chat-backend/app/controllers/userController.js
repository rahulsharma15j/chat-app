const mongoose = require('mongoose');
const shortId = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validateInput = require('./../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const UserModel = require('./../models/User');

/**User SignUp function. */
let signUpFunction = (req,res)=>{

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
