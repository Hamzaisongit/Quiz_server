import express from 'express'
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173/"],
        methods: ["GET","POST"],
        credentials: true
    }
});

app.get("/", (req, res)=>{
    res.send("hellow hamzaa");
});

io.on("connection", (socket)=>{
    console.log("User connecteddd");
    console.log(socket.id);

   socket.emit("welcome","hello")
   socket.on("message",(data)=>{
    console.log(`${socket.id} sent message : ${data}`)
   })
})

server.listen(process.env.PORT || 3000, ()=>{
    console.log("server is runnin")
})


