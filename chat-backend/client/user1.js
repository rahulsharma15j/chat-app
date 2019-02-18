//connection with sockets.
const socket = io('http://localhost:3000');

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Illmc09vRXdKbyIsImlhdCI6MTU1MDQ1NzU0MzA2MSwiZXhwIjoxNTUwNTQzOTQzLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJjaGF0QXBwIiwiZGF0YSI6eyJ1c2VySWQiOiJxTXNHc3VQSUwiLCJmaXJzdE5hbWUiOiJ0aGUgcmFodWwgc2hhcm1hIiwibGFzdE5hbWUiOiJTaGFybWEiLCJlbWFpbCI6InJzYUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjQ1NjczNDU2Nzh9fQ.sQhdN9Sm0URatDb99oM9SBxLNlOvr3NPjcAHj1SMpaI';
const userId = 'qMsGsuPIL';

let chatSocket = ()=>{
    socket.on('verifyUser', (data)=>{
      console.log('Socket trying to verify user.');
      socket.emit('set-user', authToken);
    });

    socket.on(userId, (data)=>{
      console.log('You received a message.');
      console.log(data);
    });
}

chatSocket();