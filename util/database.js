const Sequelize=require('sequelize');

const sequelize=new Sequelize('tracker-expensebackend','root','Karthik@26',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;