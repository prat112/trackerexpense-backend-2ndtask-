const { where } = require('sequelize');
const expenseModel=require('../models/expense');
const jwt=require('jsonwebtoken');

function generateAcToken(id){
    return jwt.sign({userid:id},'qR8v3cJkiPMkTyqnTpmHnjDVGHsl1kE1')
}

function isstringinvalid(string){
    if(string==undefined||string.length==0){
        return true;
    }
    return false;
}

exports.getAllExpense=async(req, res, next)=>{
    try{
        const data=await expenseModel.findAll({where:{userId:req.user.id}});
        res.status(201).json({expenseData:data,success:true});
    }
    catch(err){ 
        res.status(500).json({error:err,success:false});
    }   
};

exports.postAddExpense=async(req, res, next)=>{
    try{ 
        const amount=req.body.amount;
        const desc=req.body.description;
        const category=req.body.category;
        if(isstringinvalid(amount)||isstringinvalid(desc)||isstringinvalid(category))
        {
            return res.status(400).json({err:'Bad parameters.something is missing'});
        }
       const data= await expenseModel.create({amount:amount,description:desc,category:category,userId:req.user.id});
       res.status(201).json({newExpenseData:data,success:true,});
    }
    catch(err){
        console.log(err); 
        res.status(500).json({error:err,success:false});
    }
    
}
 
exports.postDeleteExpense=async(req,res,next)=>{
    try{
        const uId=req.params.id;
       const userDetails=await expenseModel.findAll({where:{id:uId}});
       if(req.user.id===userDetails[0].userId){
            await expenseModel.destroy({where:{id:uId}});
            res.sendStatus(200);  
       } 
       else{
            throw new Error('Access not available');
       } 
         
    }
    catch(err){
        res.status(500).json({error:err.message,success:false});
    }
};