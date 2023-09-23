const jwt=require('jsonwebtoken');
const User=require('../models/user');

const authenticate=async(req,res,next)=>{
    try{
        const token=req.header('Authorization');
        const user=jwt.verify(token,'qwertyuiop123ASDF');
        const output=await User.findByPk(user.userId);
        req.user=output;
        next();
    }
    catch(err){
        return res.status(401).json({success:false});
    }
}

module.exports={authenticate};