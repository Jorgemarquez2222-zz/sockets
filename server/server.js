'use strict';
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
var app_user=[];
var mensajes=[];

io.on('connection', (socket) => {

  socket.on('disconnect', function(){
    let index = app_user.findIndex(x => x.userId == socket.id);
    app_user.splice(index,1);
    io.emit('lista_contactos', app_user)
  });

  socket.on('user_connect', (data) => {
    app_user.push(data);
    io.emit('lista_contactos', app_user)
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message});    
  });

  socket.on('conversacion', (message) => {
    mensajes.push(message)
    io.emit('conversacion', message );    
  });
  
});

http.listen(3000, () => {
  console.log('started on port 3000');
});
