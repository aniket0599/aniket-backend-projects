const users = [];
const moment = require('moment');

//User joins a chat room
const joinUser = (id, username, room) => {
    const user = {id, username, room};
    users.push(user);
    return user;
};

//Get current user
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
};

//User disconnects or leaves chat room
const userDisconnects = (id) => {
    const userIndex = users.findIndex(user => user.id === id);
    if(userIndex !== -1){
        return users.splice(userIndex, 1)[0];
    }
}

//Get all users in a chat room
const getAllUsersInRoom = (room) => {
    return users.filter(user => user.room === room);
}

//get formated message
const getFormattedMessage = (username, text) => ({
    
        username,
        text,
        time: moment().format('h:mm a')
    
});

module.exports = {
    joinUser,
    getCurrentUser,
    userDisconnects,
    getAllUsersInRoom,
    getFormattedMessage
}


