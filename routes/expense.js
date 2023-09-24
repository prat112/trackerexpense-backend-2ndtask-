const express = require('express');
const expenseController = require('../controllers/expense');
const userauthentication=require('../middlewares/auth');

const router = express.Router();
  
router.get('/', userauthentication.authenticate , expenseController.getAllExpense); 

router.post('/add-expense', userauthentication.authenticate, expenseController.postAddExpense);

router.delete('/delete-expense/:id',userauthentication.authenticate,expenseController.postDeleteExpense);

module.exports = router; 