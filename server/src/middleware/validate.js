const validate = (schema)=> async(req,res,next)=>{
    try{
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch(error){
    return res.status(400).json({
        success: false,
        errors: error.issues,
    });
    }
};

export default validate;