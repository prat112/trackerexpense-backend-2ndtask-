const Sequelize = require('sequelize');
 
const sequelize = require('../util/database');

const password = sequelize.define('forgotpwdreq', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      }, 
      isActive:{
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue:true
      }
});
    
  
  module.exports = password;