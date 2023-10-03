const userModel = require('../models/user');
const fileModel=require('../models/fileurl');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AWS=require('aws-sdk');

function generateAcToken(id, name, ispremiumuser) {
  return jwt.sign({ userId: id, name: name, ispremiumuser}, 'qwertyuiop123ASDF');
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
              return res.status(201).json({success:true,message:'Login successfull',token:generateAcToken(allData[0].id,allData[0].name,allData[0].ispremiumuser)});
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

exports.getuser=async(req,res,next)=>{
try{
  const data=await userModel.findByPk(req.user.id);
  res.status(201).json({userData:data,success:true});
}
catch(err){ 
  res.status(500).json({error:err,success:false});
}
}

exports.getuser=async(req,res,next)=>{
  try{
      const data=await userModel.findByPk(req.user.id);
      res.status(201).json({userData:data,success:true});
  }
  catch(err){ 
      res.status(500).json({error:err,success:false});
  }
}

function uploadToS3(data,filename){
      const BUCKET_NAME=process.env.AWS_BUCKET;
      const USER_KEY=process.env.AWS_ACCESS_KEY;
      const USER_SECRET=process.env.AWS_SECRET_KEY;

      let s3bucket=new AWS.S3({
          accessKeyId:USER_KEY,
          secretAccessKey:USER_SECRET
      });

          var params={
              Bucket:BUCKET_NAME,
              Key:filename,
              Body:data,
              ACL:'public-read'
          };
          return new Promise((res,rej)=>{
              s3bucket.upload(params,(err,response)=>{
                  if(err){
                      console.log('something went wrong',err);
                      rej(err);
                  }
                  else{
                      console.log('success',response);
                      res(response.Location); 
                  }
              })
          })
          
}

exports.download=async(req,res,next)=>{
  try{
      const expenses=await req.user.getExpenses();
      const StrExpenses=JSON.stringify(expenses);
      const userId=req.user.id;
      const filename=`Expense${userId}/${new Date()}.txt`;
      const fileURL= await uploadToS3(StrExpenses,filename);
      await fileModel.create({url:fileURL,userId:userId});
      res.status(200).json({fileURL,success:true});

  }
  catch(err){
      console.log(err);
      res.status(500).json({error:err,success:false});
  }
}

exports.getDownloadHistory=async(req, res, next)=>{
  try{
      const data=await fileModel.findAll({where:{userId:req.user.id}});
      res.status(201).json({downloadData:data,success:true});
  }
  catch(err){ 
      res.status(500).json({error:err,success:false});
  }   
}; 

