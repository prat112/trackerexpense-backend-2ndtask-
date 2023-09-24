const userModel=require('../models/user');
const expenseModel=require('../models/expense');
const sequelize=require('../util/database');

exports.getLeaderboard=async(req,res,next)=>{
        try{
            const user=await userModel.findAll();
            const expense=await expenseModel.findAll();
            const allExpenses={};
            expense.forEach(expense => {
                if(allExpenses[expense.userId]){
                    allExpenses[expense.userId] += expense.amount;
                }
                else{
                    allExpenses[expense.userId] = expense.amount;
                }
            });
            var lboardDetails=[];
            user.forEach(user=>{
                lboardDetails.push({name:user.name,expense:allExpenses[user.id]||0});
            })
            lboardDetails.sort((a,b)=>b.expense-a.expense);
            res.status(200).json(lboardDetails);
        }
        catch(err){
            console.log(err);
            res.status(500).json({err});
        }
}