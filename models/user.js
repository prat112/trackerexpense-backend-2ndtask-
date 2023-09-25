const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const userData = sequelize.define('user', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        allowNull: false,
        primaryKey: true
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      email:{
          type: Sequelize.STRING,
          allowNull: false,
          unique:true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ispremiumuser:Sequelize.BOOLEAN,
      totalexpense: {
        type: Sequelize.INTEGER,
        allowNull: true, // Allow NULL values for totalexpense
      },
      
});
    
  
module.exports = userData;