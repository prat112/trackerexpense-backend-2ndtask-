const Sib=require('sib-api-v3-sdk');
require('dotenv').config();
const uuid=require('uuid');

const userModel=require('../models/user');
const bcrypt=require('bcrypt');
const path = require('path');

exports.passwordresetmail=async(req, res, next)=>{
    try{
         const uId=uuid.v4();
        //  console.log("UID=",uId);
        Sib.ApiClient.instance.authentications['api-key'].apiKey=process.env.SENDINBLUE_API_KEY;
        // console.log("apikey=",process.env.SENDINBLUE_API_KEY);
        const final= new Sib.TransactionalEmailsApi().sendTransacEmail({
            'sender':{
                'email':'kundapurprathiksha@gmail.com','name':'Expense App'
            }, 
            'to':[{
                'email':`${req.body.email}`
            }],
            'subject':'Reset password of expense app',
            'textContent':`password reset link: http://localhost:3000/password/resetpassword?uId=${uId}&email=${req.body.email}`
        })
        console.log("final=",final);
        // console.log(req.body.email);
        const user=await userModel.findOne({where:{email:req.body.email}});
        // console.log(user);
        user.forgotpwd.push({uniqueId:uId,isActive:true});
        await user.save();
        res.status(201).json({data:final,success:true});
    }
    catch(err){ 
        res.status(500).json({error:err,success:false});
    }   
}; 

exports.passwordreset=async(req, res, next)=>{
    try{
        const uId=req.params.uId;
        const email=req.query.email;
        const user=await userModel.findOne({email:email}).populate('forgotpwd');
        console.log(user);
        const pwdIndex = user.forgotpwd.findIndex(cp => {
            return cp.uniqueId.toString() === uId.toString();
          });
          if(user.forgotpwd[pwdIndex].isActive){
            user.forgotpwd[pwdIndex].isActive=false;
            await user.save();
            res.status(200).sendFile(path.join(__dirname,'..','public','html','pwdreset.html') );
          }
        else{
                throw new Error('link already used');
        }
    }
    catch(err){
        res.status(500).json({error:err.message,success:false});
    }
};
 
       

exports.passwordupdate=async(req, res, next)=>{
    try{
        const email=req.body.email;
        const pass=req.body.password;
        console.log(pass);
        const user=await userModel.findOne({where:{email:email}});
        if(user)
        {
            console.log(user);
            const saltrounds=10;
            bcrypt.hash(pass,saltrounds,async(err,hash)=>{
            if(err){
                console.log(err);
                throw new Error(err);
            }
            user.password=hash;
            await user.save();
            res.status(201).json({message:'password updated successfully'});
        })
        }
        else{
            res.status(404).json({ error: 'No user Exists', success: false})
        }
    }
    catch(err){
        res.status(500).json({error:err,success:false});
    }
};