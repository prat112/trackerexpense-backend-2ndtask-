const Sib=require('sib-api-v3-sdk');
require('dotenv').config();
const uuid=require('uuid');
const forgetpwdModel=require('../models/forgotpwdreq');
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
            'textContent':`password reset link: http://54.210.69.239:3100/password/resetpassword/${uId}`
        })
        console.log("final=",final);
        // console.log(req.body.email);
        const user=await userModel.findOne({where:{email:req.body.email}});
        // console.log(user);
        await forgetpwdModel.create({id:uId,userId:user.id});
        res.status(201).json({data:final,success:true});
    }
    catch(err){ 
        res.status(500).json({error:err,success:false});
    }   
}; 
exports.passwordreset=async(req, res, next)=>{
    try{
        const uId=req.params.uId;
        const link=await forgetpwdModel.findOne({where:{id:uId}});
       
        if(link.isActive){
            await forgetpwdModel.update({isActive:false},{where:{id:uId}});
            const filePath = path.resolve(__dirname, '..', 'public','html', 'pwdreset.html');
            console.log("File path:", filePath);
            res.redirect('/html/pwdreset.html')
    } else {
      throw new Error('link already used');
    }
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
}

       

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
            await userModel.update({password:hash},{where:{email:email}});
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