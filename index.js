var $ltMAx$path = require("path");
var $ltMAx$http = require("http");
var $ltMAx$express = require("express");
var $ltMAx$socketio = require("socket.io");
var $ltMAx$badwords = require("bad-words");

var $4fa36e821943b400$var$__dirname = "src";





var $35765e90c8a8e596$exports = {};
const $35765e90c8a8e596$var$generateMessage = (username, text)=>{
    return {
        username: username,
        text: text,
        createdAt: new Date().getTime()
    };
};
const $35765e90c8a8e596$var$generateLocationMessage = (username, url)=>{
    return {
        username: username,
        url: url,
        createdAt: new Date().getTime()
    };
};
$35765e90c8a8e596$exports = {
    generateMessage: $35765e90c8a8e596$var$generateMessage,
    generateLocationMessage: $35765e90c8a8e596$var$generateLocationMessage
};


var $4fa36e821943b400$require$generateMessage = $35765e90c8a8e596$exports.generateMessage;
var $4fa36e821943b400$require$generateLocationMessage = $35765e90c8a8e596$exports.generateLocationMessage;
var $04fd72458a723142$exports = {};
const $04fd72458a723142$var$users = [];
//addUser, removeUser, gettUser, getUsersInRoom
const $04fd72458a723142$var$addUser = ({ id: id, username: username, room: room })=>{
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // Validate the data
    if (!username || !room) return {
        error: "Username and Room are required"
    };
    // Check for existing user
    const existingUser = $04fd72458a723142$var$users.find((user)=>{
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
    $04fd72458a723142$var$users.push(user);
    return {
        user: user
    };
};
//remove user
const $04fd72458a723142$var$removeUser = (id)=>{
    const index = $04fd72458a723142$var$users.findIndex((user)=>user.id === id);
    if (index !== -1) return $04fd72458a723142$var$users.splice(index, 1)[0];
};
//Get Users
const $04fd72458a723142$var$getUser = (id)=>{
    return $04fd72458a723142$var$users.find((user)=>user.id === id);
};
//Get users from room
const $04fd72458a723142$var$getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase();
    return $04fd72458a723142$var$users.filter((user)=>user.room === room);
};
$04fd72458a723142$exports = {
    addUser: $04fd72458a723142$var$addUser,
    removeUser: $04fd72458a723142$var$removeUser,
    getUser: $04fd72458a723142$var$getUser,
    getUsersInRoom: $04fd72458a723142$var$getUsersInRoom
};


var $4fa36e821943b400$require$addUser = $04fd72458a723142$exports.addUser;
var $4fa36e821943b400$require$removeUser = $04fd72458a723142$exports.removeUser;
var $4fa36e821943b400$require$getUser = $04fd72458a723142$exports.getUser;
var $4fa36e821943b400$require$getUsersInRoom = $04fd72458a723142$exports.getUsersInRoom;
const $4fa36e821943b400$var$app = $ltMAx$express();
const $4fa36e821943b400$var$server = $ltMAx$http.createServer($4fa36e821943b400$var$app);
const $4fa36e821943b400$var$io = $ltMAx$socketio($4fa36e821943b400$var$server);
const $4fa36e821943b400$var$port = 3000;
const $4fa36e821943b400$var$publicDirectoryPath = $ltMAx$path.join($4fa36e821943b400$var$__dirname, "../public");
$4fa36e821943b400$var$app.use($ltMAx$express.static($4fa36e821943b400$var$publicDirectoryPath));
$4fa36e821943b400$var$io.on("connection", (socket)=>{
    console.log("New WebSocket connection");
    socket.on("join", (options, callback)=>{
        const { error: error, user: user } = $4fa36e821943b400$require$addUser({
            id: socket.id,
            ...options
        });
        if (error) return callback(error);
        socket.join(user.room);
        socket.emit("message", $4fa36e821943b400$require$generateMessage("Admin", "Welcome!"));
        socket.broadcast.to(user.room).emit("message", $4fa36e821943b400$require$generateMessage("Admin", `${user.username} has joined!`));
        $4fa36e821943b400$var$io.to(user.room).emit("roomData", {
            room: user.room,
            users: $4fa36e821943b400$require$getUsersInRoom(user.room)
        });
        callback();
    // socket.emit, io.emit, socket.broadcast.emit
    // io.to.emit, socket.broadcast.to.emit
    });
    socket.on("sendMessage", (message, callback)=>{
        const user = $4fa36e821943b400$require$getUser(socket.id);
        const filter = new $ltMAx$badwords();
        if (filter.isProfane(message)) return callback("Profanity is not allowed!");
        $4fa36e821943b400$var$io.to(user.room).emit("message", $4fa36e821943b400$require$generateMessage(user.username, message));
        callback();
    });
    socket.on("sendLocation", (coords, callback)=>{
        const user = $4fa36e821943b400$require$getUser(socket.id);
        $4fa36e821943b400$var$io.to(user.room).emit("locationMessage", $4fa36e821943b400$require$generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });
    socket.on("disconnect", ()=>{
        const user = $4fa36e821943b400$require$removeUser(socket.id);
        if (user) {
            $4fa36e821943b400$var$io.to(user.room).emit("message", $4fa36e821943b400$require$generateMessage("Admin", `${user.username} has left!`));
            $4fa36e821943b400$var$io.to(user.room).emit("roomData", {
                room: user.room,
                users: $4fa36e821943b400$require$getUsersInRoom(user.room)
            });
        }
    });
});
$4fa36e821943b400$var$server.listen($4fa36e821943b400$var$port, ()=>{
    console.log(`Server is up on port ${$4fa36e821943b400$var$port}!`);
});


//# sourceMappingURL=index.js.map
