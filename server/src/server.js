import dotenv from 'dotenv';
import connectDB from './config/db.js';
import http from 'http';
import {Server} from 'socket.io';
import { socketHandler } from './socket/socket.js';
import app from './app.js'


dotenv.config();

await connectDB();
export let io;

const server = http.createServer(app);
io = new Server(server,{
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
    }
})
socketHandler(io);
const PORT = process.env.PORT || 8000;

server.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
});
