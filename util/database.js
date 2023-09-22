const Sequelize=require('sequelize');

const sequelize=new Sequelize('track-expense','root','Karthik@26',{
    dialect:'mysql',
    host:'localhost' 
});

module.exports=sequelize;