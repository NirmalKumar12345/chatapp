import dotenv from 'dotenv';
import connectDB from './config/db.js';
import http from 'http';
import {Server} from 'socket.io';
import app from './app.js'


dotenv.config();

connectDB();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})
io.on('connection',(socket)=>{
    console.log("User Connected");
});
const PORT = process.env.PORT || 8000;

server.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
});