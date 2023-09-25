const userModel=require('../models/user');
const expenseModel=require('../models/expense');
const sequelize=require('../util/database');

exports.getLeaderboard=async(req,res,next)=>{
        try{
                const lboardDetails=await userModel.findAll({
                    attributes:['id','name','totalexpense'], 
                    order:[['totalexpense','DESC']]
                });
            // const lboardDetails=await userModel.findAll({
            //     attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'expense']],
            //     include:[
            //         {
            //             model:expenseModel,
            //             attributes:[]
            //         }
            //     ],
            //     group:['user.id'],
            //     order:[['expense','DESC']]
            // });
            res.status(200).json(lboardDetails);
        }
        catch(err){
            console.log(err);
            res.status(500).json({err}); 
        }
}