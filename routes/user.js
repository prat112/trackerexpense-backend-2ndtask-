const express = require('express');
const Controller = require('../controllers/signup');

const router = express.Router();

router.post('/user/signup',Controller.postAddUser);

module.exports = router; 