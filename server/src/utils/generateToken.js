import jws from 'jsonwebtoken';

const generateToken =(userId)=>{
    return jws.sign(
        {
           userId
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES
        }
    );
};

export default generateToken;