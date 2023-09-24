const express = require('express');
const premiumController = require('../controllers/premium');
const userauthentication=require('../middlewares/auth');

const router = express.Router();
  
router.get('/showleaderboard', userauthentication.authenticate , premiumController.getLeaderboard); 


module.exports = router; 