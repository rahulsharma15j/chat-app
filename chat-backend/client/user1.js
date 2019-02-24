//connection with sockets.
const socket = io('http://localhost:3000');

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjVxNmFmcUdlMCIsImlhdCI6MTU1MTAwOTU3OTc2NiwiZXhwIjoxNTUxMDk1OTc5LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJjaGF0QXBwIiwiZGF0YSI6eyJ1c2VySWQiOiJxTXNHc3VQSUwiLCJmaXJzdE5hbWUiOiJ0aGUgcmFodWwgc2hhcm1hIiwibGFzdE5hbWUiOiJTaGFybWEiLCJlbWFpbCI6InJzYUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjQ1NjczNDU2Nzh9fQ.0ewCC2A7J3IRTSWfxU6dM23XWno6RigK_PrYr0itn7E';
const userId = 'qMsGsuPIL';

let chatMessage = {
  createdOn: Date.now(),
  receiverId: '_UPHXiOhh',
  receiverName:'Ajay',
  senderId:'qMsGsuPIL',
  senderName:'Rahul'
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
      console.log('this is message '+ chatMessage.message);
      socket.emit('chat-msg', chatMessage);
    });

    $('#messageToSend').on('keypress', function(){
      socket.emit('typing','Rahul');
    });
}

chatSocket();