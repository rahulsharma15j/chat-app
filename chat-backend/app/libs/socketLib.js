const socketIo = require('socket.io');
const shortId = require('shortid');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const token = require('./../libs/tokenLib');
const Chat = require('./../models/Chat');

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
         data['chatId'] = shortId.generate();
         console.log(data);
         setTimeout(()=>{eventEmitter.emit('save-chat',data)},2000);
         myIo.emit(data.receiverId,data);
       });

       socket.on('typing', (fullName)=>{
          socket.to(socket.room).broadcast.emit('typing', fullName);
       });


    });
}

//database operation are kept outside of socket.io code
//saving chats to database
eventEmitter.on('save-chat', (data)=>{
   let newChat = new Chat({
      chatId: data.chatId,
      senderName: data.senderName,
      senderId: data.senderId,
      receiverName: data.receiverName,
      receiverId: data.receiverId,
      message: data.message,
      chatRoom : data.chatRoom,
      createdOn: data.createdOn
   });

   newChat.save((err, result)=>{
      if(err){
        console.log(`error occurred: ${err}`);
      }else if(result == undefined || result == null || result == ''){
        console.log('chat is not saved.');
      }else{
         console.log('Chat saved.');
         console.log(result);
      }
   });
});

module.exports = {
    setServer:setServer
}