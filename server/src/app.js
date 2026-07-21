import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRouter.js'
import userRoutes from './routes/userRouter.js'
import conversationRoutes from './routes/conversationRouter.js'
import messageRoutes from './routes/message.router.js'

const app  = express();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express.json());

app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.get('/api/health',(req,res)=>{
    res.status(200).json({status: "ok"});
});

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/conversations',conversationRoutes);
app.use('/api/messages',messageRoutes);

app.use((err,req,res,next)=>{
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({msg: err.message || "server error"})
})

export default app;