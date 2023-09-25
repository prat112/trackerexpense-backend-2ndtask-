const expenseModel=require('../models/expense');
const userModel=require('../models/user');
const jwt=require('jsonwebtoken');
const sequelize = require('../util/database');


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
        const t=await sequelize.transaction();
        const amount=req.body.amount;
        const desc=req.body.description;
        const category=req.body.category;
        if(isstringinvalid(amount)||isstringinvalid(desc)||isstringinvalid(category))
        {
            return res.status(400).json({err:'Bad parameters.something is missing'});
        }
        const data= await expenseModel.create({amount:amount,description:desc,category:category,userId:req.user.id},{transaction:t});
        await userModel.update({totalexpense:req.user.totalexpense + +amount},{where:{id:req.user.id},transaction:t});
        await t.commit();
        res.status(201).json({newExpenseData:data,success:true,});
    }
    catch(err){
        await t.rollback();
        console.log(err); 
        res.status(500).json({error:err,success:false});
    }
    
}
 
exports.postDeleteExpense=async(req,res,next)=>{
    try{
        const t=await sequelize.transaction();
        const uId=req.params.id;
        const expenseDetails=await expenseModel.findAll({where:{id:uId}});
        const upuser=await userModel.findByPk(req.user.id);
       if(req.user.id===expenseDetails[0].userId){
            await userModel.update({totalexpense:upuser.totalexpense - +expenseDetails[0].amount},{where:{id:req.user.id},transaction:t});
            await expenseModel.destroy({where:{id:uId},transaction:t});
            t.commit();
            res.sendStatus(200);  
       } 
       else{
            throw new Error('Access not available');
       } 
         
    }
    catch(err){
        t.rollback();
        res.status(500).json({error:err.message,success:false});
    }
};