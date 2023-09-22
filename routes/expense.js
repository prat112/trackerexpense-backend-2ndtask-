const express = require('express');
const expenseController = require('../controllers/expense');

const router = express.Router();
  
router.get('/',expenseController.getAllExpense);

router.post('/add-expense', expenseController.postAddExpense);

router.delete('/delete-expense/:id',expenseController.postDeleteExpense);

module.exports = router; 