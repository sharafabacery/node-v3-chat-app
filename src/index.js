const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
const Filter = require('bad-words')
const {
    genrateMessage,
    genrateLocationMessage
} = require('./utils/messages')
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users')
const app = express();
const server = http.createServer(app) //for passing
const io = socketio(server) //expect to run with http server

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {

    socket.on('join', ({
        username,
        room
    }, callback) => {
        const {
            error,
            user
        } = addUser({
            id: socket.id,
            username,
            room
        })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', genrateMessage('Welcome'))
        socket.broadcast.to(user.room).emit('message', genrateMessage(`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })
    socket.on('sendMessage', (message, callback) => {
        const user=getUser(socket.id);
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('profanity is not allowed')
        }
        io.to(user.room).emit('message', genrateMessage(message,user.username))
        callback()
    })
    socket.on('sendLocation', (position, callback) => {
         const user=getUser(socket.id);
        //console.log(position)
        io.to(user.room).emit("LocationMessage", genrateLocationMessage(position,user.username))
        callback()
    })

    socket.on('disconnect', () => {
       const user= removeUser(socket.id)
        if (user) {
        io.to(user.room).emit('message', genrateMessage(`${user.username} has left!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })   
        }
    })

})



server.listen(port, () => {
    console.log('Running at Port 3000');
});