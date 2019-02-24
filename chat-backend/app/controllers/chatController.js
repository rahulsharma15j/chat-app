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
       console.log(req.query);
       return new Promise((resolve, reject)=>{
          if(check.isEmpty(req.query.senderId) || check.isEmpty(req.query.receiverId)){
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
      res.send(response.generate(false,'All Chats listed.', 200, result));
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

let countUnSeenChat = (req, res)=>{
   //function to validate params.
   let validateParams = ()=>{
       return new Promise((resolve, reject)=>{
           if(check.isEmpty(req.query.userId)){
             logger.info('Parameters missing.','countUnseenchat hadler',9);
             reject(response.generate(true,'Parameters missing.',404,null));
           }else{
               resolve(req);
           }
       });
   }

   //function to get chats.
   let countChat = ()=>{
       return new Promise((resolve,reject)=>{
           //creating find query.
           let findQuery = {};
           findQuery['receiverId'] = req.query.userId;
           findQuery['seen'] = false;

           if(check.isEmpty(req.query.senderId) === false){
              findQuery['senderId'] = req.query.senderId;
           }
           Chat.count(findQuery)
           .exec((err, result)=>{
              if(err){
                console.log(err);
                logger.error(err.message,'chat controller. countunseen chat',10);
                reject(response.generate(true,`error occurred: ${err.message}`, 500, null));
              }else{
                  console.log('unseen chat count found.');
                  resolve(result);
              }
           });
       });
   }

   //making promise call.
   validateParams(req,res)
   .then(countChat)
   .then((result)=>{
      res.send(response.generate(false,'unseen chat count found',200, result));
   })
   .catch((err)=>{
      res.send(err);
   });
}

/**
 * function to get unread messages
 * params: userId, senderId.
 */
let findUnSeenChat = (req, res)=>{
   //function to validate params.
   let validateParams = ()=>{
       return new Promise((resolve,reject)=>{
          if(check.isEmpty(req.query.userId)){
            logger.info('Parameters missing.','findUnseenChat handler',9);
            reject(response.generate(true,'Parameters missing.',403,null));
          }{ resolve() }
       });
   }

   //function to get chats.
   let findChats = ()=>{
       return new Promise((resove, reject)=>{
         //creating find query.
         let findQuery = {};

         findQuery['receiverId'] = req.query.userId;
         findQuery['seen'] = false;

         if(check.isEmpty(req.query.senderId === false)){
            findQuery['senderId'] = req.query.senderId;
         }

         Chat.find(findQuery)
         .select('-_id -__v')
         .sort('-createdOn')
         .skip(parseInt(req.query.skip) || 0)
         .lean()
         .limit(10)
         .exec((err, result)=>{
             if(err,result){
                console.log(err);
                logger.error(err.message,`Chat controller: findUnseenchat`,10);
                reject(response.generate(true,`error occurred: ${err.message}`, 500,null));
             }else if(check.isEmpty(result)){
                logger.info('No chat found.','Chat controller: findUnseenChat');
                reject(response.generate(true,'No chat found.',404,null));
             }else{
                 console.log('chat found and listed.');
                 let reverseResult = result.reverse();
                 resolve(result);
             }
         });
       });
   }

   //making promise call.
   validateParams()
   .then(findChats)
   .then((result)=>{
      res.send(response.generate(false,'chat found and listed.',200, result));
   })
   .catch((err)=>{
      res.send(err);
   });
}//end of the findUnseenChatfunction.

/**
 * function to find user from whom chat is unseen.
 * params: userId.
 */
let findUserListOfUnseenChat = ()=>{
    console.log('inside finduserlistofunseenchat function');

    //function to validate params.
    let validateParams = ()=>{
        return new Promise((resolve,reject)=>{
          if(check.isEmpty(req.query.userId)){
            logger.info('Parameters missing.','findUserListOfUnseenChat handler',9);
            reject(response.generate(true,'Parameters missing.', 403,null));
          }else {
              resolve(req);
          }
        });
    }//end of the validate params.

    //find distinct sender.
    let findDistinctSender = ()=>{
        return new Promise((resove,reject)=>{
            Chat.distinct('senderId',{receiverId:req.query.userId, seen: false})
            .exec((err, senderIdList)=>{
               if(err){
                  console.log(err);
                  logger.error(err.message,'Chat controller: findUserListOfUnseenChat', 10);
                  reject(response.generate(true,`error occurred: ${err.message}`, 500,null));
               }else if(check.isEmpty(senderIdList)){
                  logger.info('No unseen chat user found.','Chat controller: findUserListOfUnseenChat');
                  reject(response.generate(true,'No unseen chat user found', 404, null));
               }else{
                   console.log('user found and user id listed.');
                   console.log(senderIdList);
                   resolve(senderIdList);
               }
            })
        });
    }//end of finddistinctSender function.

    //function to find user info.
    let findUserInfo = (senderIdList)=>{
       return new Promise((resolve, reject)=>{
          User.find({userId:{$in:senderIdList}})
          .select('-_id -__v -password -email -mobileNumber')
          .lean()
          .exec((err, result)=>{
             if(err){
               logger.error(err.message,'Chat controller: findUserListOfUnseenChat',10);
               reject(response.generate(true,`error occurred: ${err.message}`, 500 ,null));
             }else if(check.isEmpty(result)){
               logger.info('No user found.','Chat controller: findUserListOfUnseenChat');
               reject(response.generate(true,'No user found.', 404,null));
             }else{
                 console.log('user found and userId listed.');
                 resolve(result);
             }
          });
       });
    }//end of findUserInfo.

    validateParams(req,res)
    .then(findDistinctSender)
    .then(findUserInfo)
    .then((result)=>{
        res.send(response.generate(false,'user found and listed.',200, result));
    })
    .catch((err)=>{
        res.send(err);
    });

}//end of findUserListOfUnseenChat function.

/**
 * exporting function.
 */
module.exports = {
    getUsersChat:getUsersChat,
    getGroupChat:getGroupChat,
    markChatAsSeen:markChatAsSeen,
    countUnSeenChat:countUnSeenChat,
    findUnSeenChat:findUnSeenChat,
    findUserListOfUnseenChat:findUserListOfUnseenChat
}




