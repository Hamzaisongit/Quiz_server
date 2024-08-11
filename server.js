const express = require('express')
const {Server} = require('socket.io')
const {createServer} = require('http')
const path = require('path');
const fs = require('fs')

// import express from 'express'
// import { Server } from 'socket.io';
// import { createServer } from 'http';
// import path, {dirname} from 'path';

// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express();
const server = createServer(app)
const rawDataPath = 'rawData.json'

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173","https://quiz-client-10.onrender.com"]
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.send("hamza's server")
})

app.get('/index',(req,res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/data',(req,res)=>{
    res.sendFile(path.join(__dirname, rawDataPath))
})

io.on("connection", (socket)=>{
    console.log("User connecteddd");
    console.log(socket.id);

   socket.emit("welcome","hello")

   socket.on("message",(data)=>{
   console.log(`${socket.id} sent message : ${JSON.stringify(data)}`)
   fs.readFile(rawDataPath,"utf-8",(err,fileData)=>{
    if(err){
        console.log(err)
    }else{
        const json = JSON.parse(fileData)
        json.push(data)
        fs.writeFile(rawDataPath, JSON.stringify(json),(err)=>{
            console.log(err)
           });   
    }
   })

   })
})

server.listen(process.env.PORT || 3000, ()=>{
    if(!fs.existsSync(rawDataPath)){
       console.log("no rawData found..creating One")
       fs.writeFileSync(rawDataPath,"[]")
    }
    console.log("server is runnin on" + process.env.PORT)
})




