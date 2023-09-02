const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
    joinUser,
    getCurrentUser,
    userDisconnects,
    getAllUsersInRoom,
    getFormattedMessage
} = require("./helpers/helper");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static("public"));

const appName = "Unwind Chat Rooms";

io.on("connection", (socket) => {
    socket.on("joinRoom", ({username, room}) => {
        const user = joinUser(socket.id, username, room);
        socket.join(room);
        socket.emit("message", getFormattedMessage(appName, 'Welcome to Unwind Chat Rooms'));
        socket.broadcast.to(user.room).emit("message", getFormattedMessage(appName, user.username + ' has joined the chat in ' + user.room + ' room'));

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getAllUsersInRoom(user.room)
        });
    });

    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", getFormattedMessage(user.username, msg));
    });

    socket.on("disconnect", () => {
        const user = userDisconnects(socket.id);
        if(user) {
            io.to(user.room).emit("message", getFormattedMessage(appName, user.username +' has left the chat'));

            //send updated user and room info
            io.to(user.room).emit("roomUsers", {
                room : user.room,
                users: getAllUsersInRoom(user.room)
            });
        }
    });//end of disconnect socket
});

const PORT = 3000;
server.listen(PORT, () => console.log('Server is running successfully on port' + PORT));
  