const express = require('express');
const purchaseController = require('../controllers/purchase');
const userauthentication=require('../middlewares/auth');

const router = express.Router();

router.get('/premiummembership',userauthentication.authenticate,purchaseController.purchasepremium);

router.post('/updatetrstatus',userauthentication.authenticate,purchaseController.updateTransactionStatus);

module.exports=router;