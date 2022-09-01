require('dotenv').config();
const express = require('express');
const cors = require('cors');
const socket = require("socket.io");
const {corsOptionsDelegate} = require('./config/cors');
const message = require('./models/message');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(require('cookie-parser')())
app.use(cors(corsOptionsDelegate))


app.use(require('./routes'))

const server = app.listen(process.env.PORT , () => console.log(`Server is listening on port ${process.env.PORT}`))

const io = socket(server, {
    cors: {
      origin: "http://telegram.alzhik.site:3010",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    },
  });

  
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    // console.log(socket)
    socket.on("add-user", (userId) => {
      console.log(userId);
      onlineUsers.set(userId, socket.id);
    });

    socket.join('room');
    console.log(onlineUsers);
    // console.log(socket);
    socket.on("send-msg", (data) => {
      console.log(data);
      let sendUserSocket;
      try{
        sendUserSocket = onlineUsers.get(data.to.toString());
      }catch(err){
         sendUserSocket = 'room';
      }
      console.log(sendUserSocket)
        socket.to(sendUserSocket).emit("msg-recieve", data.msg, data.avatar, data.full_name);
    });

    socket.on(message, (message) => {
        io.sockets.emit("message-client", {
            message
        })
    })
  });