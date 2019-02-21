const mongoose = require('mongoose');
const shortId = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validateLib = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const token = require('../libs/tokenLib');

const Chat = require('../models/Chat');
const User = require('../models/User');
const Auth = require('../models/Auth');

/**
 * funtion to retrieve chat of user.
 * params: receiverId, senderId, skip.
 */
let getUsersChat = (req,res)=>{ 
    //function to validate params.
   let validateParams = ()=>{
       return new Promise((resolve, reject)=>{
          if(check.isEmpty(req.params.senderId) || check.isEmpty(req.params.receiverId)){
              logger.info('Parameters missing.', 'getUsersChat handler', 9);
              reject(response.generate(true,'parameters missing.',403,null));
          }else { resolve(req) }
       });
   }

   //function to get chats.
   let findChats = ()=>{
       return new Promise((resolve, reject)=>{
         //creating find query.
         let findQuery = {
             $or:[
                 {
                     $and:[
                         {senderId: req.query.senderId},
                         {receiverId: req.query.receiverId}
                     ]
                 },
                 {
                     $and:[
                         {receiverId: req.query.senderId},
                         {senderId: req.query.receiverId}
                     ]
                 }
             ]
         }

         Chat.find(findQuery)
         .select('-_id -__v -chatRoom')
         .sort('-createdOn')
         .skip(parseInt(req.query.skip) || 0)
         .lean()
         .limit(10)
         .exec(()=>{
             
         })
       });
   }


}