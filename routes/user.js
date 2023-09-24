const express = require('express');
const userController = require('../controllers/user');
const userauthentication=require('../middlewares/auth');

const router = express.Router();

router.get('/',userauthentication.authenticate,userController.getuser);

router.post('/login',userController.login);

router.post('/signup', userController.signup);

module.exports = router; 