const { error } = require('console');
const userModel = require('../models/signup');

const path=require('path');

exports.postAddUser=async(req,res,next)=>{
    try{
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const allData= await userModel.findAll();
        allData.forEach(element => {
           if(element.email===email) 
           {
                throw new Error('User already exists');
           }
        });
        const data=await userModel.create({name:name,email:email,password:password});
        res.status(201).json({newUserData:data});
    }
    catch(err){
        res.status(500).json({error:err});
    }
}