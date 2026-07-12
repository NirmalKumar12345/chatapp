import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js'

dotenv.config();

connectDB();
const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}`)
});