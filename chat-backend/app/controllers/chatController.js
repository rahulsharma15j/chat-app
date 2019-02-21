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
         .exec((err, result)=>{
             if(err){
               console.log(err);
               logger.error(err.message,'Chat controller: getUsersChat',10);
               reject(response.generate(true,`error occured: ${err.message}`,500,null));
             }else if(check.isEmpty(result)){
               logger.info('No chat found.','chatcontroller getuserschat');
               reject(response.generate(true,'No chat found.',404,null));
             }else{
                 console.log('chat found and listed.');
                 let reverseResult = result.reverse();
                 resolve(reverseResult);
             }
         })
       });
   }

  validateParams(req,res)
  .then(findChats)
  .then((result)=>{
      res.send(false,'All Chats listed.', 200, result);
  })
  .catch((err)=>{
     res.send(err);
  });
}

/**
 * function to retrieve chat of the group.
 * params: chatRoom, skip.
 */
let getGroupChat = (req,res)=>{
    //function to validate params.
    let validateParams = ()=>{
        return new Promise((resolve, reject)=>{
           if(check.isEmpty(req.query.chatRoom)){
             logger.info('Parameters missing','getUsersChat handler.',9);
             reject(response.generate(true,'Parameters missing.', 403,null));
           }else{
               resolve(req);
           }
        });
    }
     
    //function to get chats.
    let findChats = ()=>{
        return new Promise((resolve, reject)=>{
           //creating findQuery
           let findQuery = {
               chatRoom: req.query.chatRoom
           }

           Chat.find(findQuery)
           .select('-_id -__v -receiverName -receiverId')
           .sort('-createdOn')
           .skip(parseInt(req.query.skip) || 0)
           .lean()
           .limit(10)
           .exec((err, result)=>{
               if(err){
                  console.log(err);
                  logger.error(err.message,'Chat controller: getUsersChat',10);
                  reject(response.generate(true,`error occurred: ${err.message}`, 500,null));
               }else if(check.isEmpty(result)){
                  logger.info('No chat found.','Chat controller: getUserschat');
                  reject(response.generate(true,'No chat found.', 404,null));
               }else {
                   console.log('chat found and listed.');
                   let reverseResult = result.reverse();
                   resolve(reverseResult);
               }
           });
        });
    }

    validateParams(req,res)
    .then(findChats)
    .then((result)=>{
        res.send(false, 'All group chat listed',200,result);
    })
    .catch((err)=>{
       res.send(err);
    });
}

/**
 * function to mark multi chat as seen.
 * params: chatIdCsv
 */
let markChatAsSeen = (req,res)=>{
   //function to validate params.
   let validateParams = ()=>{
       return new Promise((resolve,reject)=>{
          if(check.isEmpty(req.query.chatIdCsv)){
             logger.info('Parameter missing.','markChatAsSeen handler', 9);
             reject(response.generate(true,'Parameter missing.', 403, null));
          }else {
              resolve(req);
          }
       });
   }

   //function to mark chat as seen.
   let modifyChat = ()=>{
       return new Promise((resolve,reject)=>{
           let findQuery = {
               chatId: req.query.chatIdCsv
           }
           let updateQuery = {
               seen: true
           }

           Chat.update(findQuery,updateQuery,{multi: true})
           .exec((err,result)=>{
              if(err){
                console.log(err);
                logger.error(err.message,'Chat controller: markChatAsSeen',10);
                reject(response.generate(true,`error occured: ${err.message}`, 500,null));
              }else if(result.n === 0){
                 logger.info('No chat found.','Chat controller: markChatAsSeen');
                 reject(response.generate(true,'No chat found.', 404, null));
              }else{
                  console.log('chat found and updated.');
                  resolve(result);
              }
           })
       });
   }

   //making promise call.
   validateParams()
   .then(modifyChat)
   .then((result)=>{
      res.send(response.generate(false,'chat found and updated.', 200, result));
   })
   .catch((err)=>{
      res.send(err);
   });
}