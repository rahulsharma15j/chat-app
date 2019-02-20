const socketIo = require('socket.io');
const mongoose = require('mongoose');
const shortId = require('shortid');
const logger = require('./loggerLib');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const token = require('./../libs/tokenLib');
const check = require('./checkLib');
const response = require('./responseLib');

let setServer = (server)=>{
    let allOnlineUsers = [];
    let io = socketIo.listen(server);
    let myIo = io.of('');
    myIo.on('connection', (socket)=>{
       console.log('On connection emitting verify user.');
       socket.emit('verifyUser','');
       socket.on('set-user', (authToken)=>{
          console.log('set-user called.');
          token.verifyClaimWithoutSecret(authToken, (err, user)=>{
             if(err){
                socket.emit('auth-error',{ status: 500, error: 'Please provide corret auth token.'});
             }else{
                console.log('user is verified --- setting details.');
                let currentUser = user.data;
                socket.userId = currentUser.userId;
                let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
                console.log(`${fullName} is online.`);
                //socket.emit(currentUser.userId, 'You are online.');
                
                let userObj = { userId:currentUser.userId , fullName:fullName };
                allOnlineUsers.push(userObj);
                console.log(allOnlineUsers);

                //setting room name
                socket.room = 'edChat';
                //joining chat-group room.
                socket.join(socket.room);
                socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);
             }
          });
       })

       socket.on('disconnect', ()=>{
           console.log('user is disconnected.');
           console.log(socket.userId);
           let removeIndex = allOnlineUsers.map(function(user){ return user.userId }).indexOf(socket.userId);
           allOnlineUsers.splice(removeIndex,1);
           console.log(allOnlineUsers);
           socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);
           socket.leave(socket.room);
       });

       socket.on('chat-msg',(data)=>{
         console.log(data);
         myIo.emit(data.receiverId,data);
       });

       socket.on('typing', (fullName)=>{
          socket.to(socket.room).broadcast.emit('typing', fullName);
       });


    });
}


module.exports = {
    setServer:setServer
}