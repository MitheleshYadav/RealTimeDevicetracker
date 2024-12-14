const ex  = require('express');
const app = ex();
const cors = require('cors')
const http = require('http');
const {Server} = require('socket.io');
const server = http.createServer(app);

app.use(cors());
const io = new Server(server,{
    cors: {
        origin : 'https://real-time-devicetracker.vercel.app',
        methods : ['GET', 'Post']
    }
});

let user={};

io.on('connection',(socket)=>{
    console.log("succesfully connected")
    socket.on('newLocation', (data)=>{
        user[socket.id] = data;
        io.emit('toAll',user);
    })
    // socket.on('disconnect',()=>{
    //     delete user[socket.id];
    //     io.emit('toAll', user);
    // })
})



server.listen(8080);
