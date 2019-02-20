//connection with sockets.
const socket = io('http://localhost:3000');

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InJmNVBPeDZrNyIsImlhdCI6MTU1MDYyMjc0ODY4MiwiZXhwIjoxNTUwNzA5MTQ4LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJjaGF0QXBwIiwiZGF0YSI6eyJ1c2VySWQiOiJfVVBIWGlPaGgiLCJmaXJzdE5hbWUiOiJBamF5IiwibGFzdE5hbWUiOiJTaGFybWEiLCJlbWFpbCI6ImFqYXlAZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjo5ODc2NTQ1Njc4fX0.vSiUYhJVPrX0DUAiMaeYtNwAoGc1A7BAiJV0iCkK5Hc';
const userId = '_UPHXiOhh';

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'qMsGsuPIL',
  receiverName:'Rahul',
  senderId:'_UPHXiOhh',
  senderName:'Ajay'
}

let chatSocket = ()=>{
    socket.on('verifyUser', (data)=>{
      console.log('Socket trying to verify user.');
      socket.emit('set-user', authToken);
    });

    socket.on(userId, (data)=>{
      console.log('You received a message from '+ data.senderName);
      console.log(data.message);
    });

    socket.on('online-user-list', (data)=>{
      console.log('Online users list is updated. some user can online or went ofline.');
      console.log(data);
    });

    socket.on('typing', (data)=>{
      console.log(data + ' is typing.');
    });

    $('#send').on('click', function(){
      let messageText = $('#messageToSend').val();
      chatMessage.message = messageText;
      socket.emit('chat-msg', chatMessage);
    });

    $('#messageToSend').on('keypress', function(){
      socket.emit('typing','Ajay');
    });
}

chatSocket();