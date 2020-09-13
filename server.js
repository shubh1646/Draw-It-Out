const http = require('http')
const express = require('express')
const app = express()

const server = http.createServer(app);
const socketio = require('socket.io')

const io = socketio(server)


let users = {
    'shubham': '123'
}
let socketMap = {};

io.on('connection', (socket) => {


    //code for chat feature 


    function login(s, u) {
        s.join(u);
        s.emit('logged_in')
        s.broadcast.emit('show_in', u)
        s.emit('show_in', u)
        socketMap[s.id] = u
        console.log(socketMap)

    }

    socket.on('login', (data) => {
        console.log(users)
        if (users[data.username]) {
            if (users[data.username] == data.password) {

                login(socket, data.username);
            }
            else {

                socket.emit('login_failed')

            }

        }
        else {


            users[data.username] = data.password
            login(socket, data.username); //back to client
        }

        socket.on("disconnect", () => {

            io.emit("user_disconnected", data.username);
        });


    })


    socket.on('msg_send', (data) => {
        data.from = socketMap[socket.id]
        console.log(data.from)

        socket.emit('msg_rcvd', data)
        socket.broadcast.emit('msg_rcvd', data)

    })










    //Whiteboard drawing code 

    socket.on("draw", (data) => {
        socket.broadcast.emit('lets_draw', data);
    })


    socket.on('done', () => {
        socket.broadcast.emit('done')
    })

    socket.on('color_change', (data) => {
        console.log("color is changes", data)
        socket.broadcast.emit('color_cchange', data)
    })

    socket.on('size_changed', (data) => {
        console.log("brush size is changed")
        socket.broadcast.emit('size_changed', data)
    })
})







app.use('/', express.static(__dirname + '/public'));










server.listen(3344, () => {
    console.log('Started on http://localhost:3344')
})