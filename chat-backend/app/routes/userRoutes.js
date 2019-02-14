const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const appConfig = require('./../../config/appConfig');
const auth = require('./../middlewares/auth');

module.exports.setRouter = (app)=>{
    let baseUrl = `${appConfig.apiVersion}/users`;
    /**Defining routes. */
    /**Params: firstName, lastName, email, mobileNumber, password */
    app.post(`${baseUrl}/signup`,userController.signUpFunction);

    /**Params: email, password */
    app.post(`${baseUrl}/login`,userController.logInFunction);

    /**Params: userId */
    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logOut);

    /**Params: userId */
    app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);

    /**Get all users. */
    app.get(`${baseUrl}/view/all`, auth.isAuthorized, userController.getAllUsers);

    /**Get single user, Params: userId*/
    app.get(`${baseUrl}/:userId/details`, auth.isAuthorized, userController.getSingleUser);

    /**Params: userId */
    app.put(`${baseUrl}/:userId/edit`, auth.isAuthorized, userController.editUser);
}