import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRouter.js'
import userRoutes from './routes/userRouter.js'

const app  = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
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

app.use((err,req,res,next)=>{
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({msg: err.message || "server error"})
})

export default app;