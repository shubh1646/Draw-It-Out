const http = require('http')
const express = require('express')
const app = express()

const server = http.createServer(app);
const socketio = require('socket.io')

const io = socketio(server)



io.on('connection', (socket) => {


    socket.on("draw", (data) => {
        //  console.log("inside the server draw ",data)
        socket.broadcast.emit('lets_draw', data);
    })



    socket.on('done', () => {
        socket.broadcast.emit('done')
    })

    socket.on('color_change', (data) => {
        console.log("color is changes", data)
        socket.broadcast.emit('color_cchange', data)
    })

     socket.on('size_changed',(data)=>{
         console.log("brush size is changed")
         socket.broadcast.emit('size_changed',data)
     })
})



app.use('/', express.static(__dirname + '/public'));





server.listen(3344, () => {
    console.log('Started on http://localhost:3344')
})