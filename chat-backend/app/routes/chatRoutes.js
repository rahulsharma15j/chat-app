const express = require('express');
const router = express.Router();
const chatController = require('./../controllers/chatController');
const appConfig = require('./../../config/appConfig');
const auth = require('./../middlewares/auth');

module.exports.setRouter = (app)=>{
    let baseUrl = `${appConfig.apiVersion}/chat`;

    //params: senderId, receiverId, skip.
    app.get(`${baseUrl}/get/for/user`, auth.isAuthorized, chatController.getUsersChat);

    //params: chatRoom, skip.
    app.get(`${baseUrl}/get/for/group`, auth.isAuthorized, chatController.getGroupChat);

    //params: chatIdCsv.
    app.post(`${baseUrl}/mark/as/seen`, auth.isAuthorized, chatController.markChatAsSeen);

    //params: userId, senderId.
    app.get(`${baseUrl}/count/unseen`, auth.isAuthorized, chatController.countUnSeenChat);

    //params: userId, senderId, skip.
    app.get(`${baseUrl}/find/unseen`, auth.isAuthorized, chatController.findUnSeenChat);

    //params: userId.
    app.get(`${baseUrl}/unseen/user/list`, auth.isAuthorized, chatController.findUserListOfUnseenChat);
}
