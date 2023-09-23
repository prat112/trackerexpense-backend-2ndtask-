const userModel=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

function generateAcToken(id){
    return jwt.sign({userId:id},'qwertyuiop123ASDF')
}

function isstringinvalid(string){
        if(string==undefined||string.length==0){
            return true;
        }
        return false;
}
exports.signup=async(req,res,next)=>{
    try{
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        if(isstringinvalid(name)||isstringinvalid(email)||isstringinvalid(password))
        {
            return res.status(400).json({err:'Bad parameters.something is missing'});
        }
        const allData= await userModel.findAll();
        allData.forEach(element => {
           if(element.email===email) 
           {
                throw new Error('User already exists');
           }
        });
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            console.log(err);
            await userModel.create({name:name,email:email,password:hash});
            res.status(201).json({message:'new user created successfully'});
        })
        
    }
    catch(err){
        res.status(500).json({err});
    }
}

exports.login=async(req,res,next)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        if(isstringinvalid(email)||isstringinvalid(password)){
            return res.status(400).json({err:'Bad parameters.something is missing',success:false});
        }
        const allData= await userModel.findAll({where:{email:email}});
        if(allData.length>0)
        {
            bcrypt.compare(password,allData[0].password,(err,result)=>{
                if(err){
                    throw new Error('Something went wrong');
                }
                if(result===true)
                {
                    return res.status(201).json({success:true,message:'Login successfull',token:generateAcToken(allData[0].id)});
                }
                else
                {
                    return res.status(400).json({success:false,message:'Incorrect password'});
                }
            })
        }
        else{
            return res.status(404).json({success:false,message:'User not found'});
        } 
    }
    catch(err){
        res.status(500).json({message:err,success:false,});
    }
}