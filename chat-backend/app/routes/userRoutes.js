const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const appConfig = require('./../../config/appConfig');

module.exports.setRouter = (app)=>{
    let baseUrl = `${appConfig.apiVersion}/users`;
    /**Defining routes. */
    /**Params: firstName, lastName, email, mobileNumber, password */
    app.post(`${baseUrl}/signup`,userController.signUpFunction);

    /**Params: email, password */
    app.post(`${baseUrl}/login`,userController.logInFunction);

    /**Params: userId */
    app.post(`${baseUrl}/logout`,userController.logOut);
}