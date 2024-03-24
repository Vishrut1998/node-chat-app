var $bHPwZ$path = require("path");
var $bHPwZ$http = require("http");
var $bHPwZ$express = require("express");
var $bHPwZ$socketio = require("socket.io");
var $bHPwZ$badwords = require("bad-words");

var $449aaa0721dc4137$var$__dirname = "src";





var $2bcb21ce3a646ee4$exports = {};
const $2bcb21ce3a646ee4$var$generateMessage = (username, text)=>{
    return {
        username: username,
        text: text,
        createdAt: new Date().getTime()
    };
};
const $2bcb21ce3a646ee4$var$generateLocationMessage = (username, url)=>{
    return {
        username: username,
        url: url,
        createdAt: new Date().getTime()
    };
};
$2bcb21ce3a646ee4$exports = {
    generateMessage: $2bcb21ce3a646ee4$var$generateMessage,
    generateLocationMessage: $2bcb21ce3a646ee4$var$generateLocationMessage
};


var $449aaa0721dc4137$require$generateMessage = $2bcb21ce3a646ee4$exports.generateMessage;
var $449aaa0721dc4137$require$generateLocationMessage = $2bcb21ce3a646ee4$exports.generateLocationMessage;
var $eea9e908a4f0c5e7$exports = {};
const $eea9e908a4f0c5e7$var$users = [];
//addUser, removeUser, gettUser, getUsersInRoom
const $eea9e908a4f0c5e7$var$addUser = ({ id: id, username: username, room: room })=>{
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // Validate the data
    if (!username || !room) return {
        error: "Username and Room are required"
    };
    // Check for existing user
    const existingUser = $eea9e908a4f0c5e7$var$users.find((user)=>{
        return user, room === room && user.username === username;
    });
    // Validate username
    if (existingUser) return {
        error: "Username is in use!"
    };
    //Store the User
    const user = {
        id: id,
        username: username,
        room: room
    };
    $eea9e908a4f0c5e7$var$users.push(user);
    return {
        user: user
    };
};
//remove user
const $eea9e908a4f0c5e7$var$removeUser = (id)=>{
    const index = $eea9e908a4f0c5e7$var$users.findIndex((user)=>user.id === id);
    if (index !== -1) return $eea9e908a4f0c5e7$var$users.splice(index, 1)[0];
};
//Get Users
const $eea9e908a4f0c5e7$var$getUser = (id)=>{
    return $eea9e908a4f0c5e7$var$users.find((user)=>user.id === id);
};
//Get users from room
const $eea9e908a4f0c5e7$var$getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase();
    return $eea9e908a4f0c5e7$var$users.filter((user)=>user.room === room);
};
$eea9e908a4f0c5e7$exports = {
    addUser: $eea9e908a4f0c5e7$var$addUser,
    removeUser: $eea9e908a4f0c5e7$var$removeUser,
    getUser: $eea9e908a4f0c5e7$var$getUser,
    getUsersInRoom: $eea9e908a4f0c5e7$var$getUsersInRoom
};


var $449aaa0721dc4137$require$addUser = $eea9e908a4f0c5e7$exports.addUser;
var $449aaa0721dc4137$require$removeUser = $eea9e908a4f0c5e7$exports.removeUser;
var $449aaa0721dc4137$require$getUser = $eea9e908a4f0c5e7$exports.getUser;
var $449aaa0721dc4137$require$getUsersInRoom = $eea9e908a4f0c5e7$exports.getUsersInRoom;
const $449aaa0721dc4137$var$app = $bHPwZ$express();
const $449aaa0721dc4137$var$server = $bHPwZ$http.createServer($449aaa0721dc4137$var$app);
const $449aaa0721dc4137$var$io = $bHPwZ$socketio($449aaa0721dc4137$var$server);
const $449aaa0721dc4137$var$port = 3000;
const $449aaa0721dc4137$var$publicDirectoryPath = $bHPwZ$path.join($449aaa0721dc4137$var$__dirname, "../public");
$449aaa0721dc4137$var$app.use($bHPwZ$express.static($449aaa0721dc4137$var$publicDirectoryPath));
$449aaa0721dc4137$var$io.on("connection", (socket)=>{
    console.log("New WebSocket connection");
    socket.on("join", (options, callback)=>{
        const { error: error, user: user } = $449aaa0721dc4137$require$addUser({
            id: socket.id,
            ...options
        });
        if (error) return callback(error);
        socket.join(user.room);
        socket.emit("message", $449aaa0721dc4137$require$generateMessage("Admin", "Welcome!"));
        socket.broadcast.to(user.room).emit("message", $449aaa0721dc4137$require$generateMessage("Admin", `${user.username} has joined!`));
        $449aaa0721dc4137$var$io.to(user.room).emit("roomData", {
            room: user.room,
            users: $449aaa0721dc4137$require$getUsersInRoom(user.room)
        });
        callback();
    // socket.emit, io.emit, socket.broadcast.emit
    // io.to.emit, socket.broadcast.to.emit
    });
    socket.on("sendMessage", (message, callback)=>{
        const user = $449aaa0721dc4137$require$getUser(socket.id);
        const filter = new $bHPwZ$badwords();
        if (filter.isProfane(message)) return callback("Profanity is not allowed!");
        $449aaa0721dc4137$var$io.to(user.room).emit("message", $449aaa0721dc4137$require$generateMessage(user.username, message));
        callback();
    });
    socket.on("sendLocation", (coords, callback)=>{
        const user = $449aaa0721dc4137$require$getUser(socket.id);
        $449aaa0721dc4137$var$io.to(user.room).emit("locationMessage", $449aaa0721dc4137$require$generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });
    socket.on("disconnect", ()=>{
        const user = $449aaa0721dc4137$require$removeUser(socket.id);
        if (user) {
            $449aaa0721dc4137$var$io.to(user.room).emit("message", $449aaa0721dc4137$require$generateMessage("Admin", `${user.username} has left!`));
            $449aaa0721dc4137$var$io.to(user.room).emit("roomData", {
                room: user.room,
                users: $449aaa0721dc4137$require$getUsersInRoom(user.room)
            });
        }
    });
});
$449aaa0721dc4137$var$server.listen($449aaa0721dc4137$var$port, ()=>{
    console.log(`Server is up on port ${$449aaa0721dc4137$var$port}!`);
});


//# sourceMappingURL=index.js.map
