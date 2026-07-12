import express from 'express';
import cors from 'cors';

const app  = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());

app.get('/api/health',(req,res)=>{
    res.status(200).json({status: "ok"});
});

app.use((err,req,res,next)=>{
    console.error(error);
    const status = err.status || 500;
    res.status(status).json({msg: err.message || "server error"})
})

export default app;