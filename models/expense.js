const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const expense = sequelize.define('expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: { // Add this field
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = expense;