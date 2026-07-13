import jws from 'jsonwebtoken';

const generateToken =(userId)=>{
    return jws.sign(
        {
            userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.EXPIRATION_TIME
        }
    );
};

export default generateToken;