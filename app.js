const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
require('dotenv').config();
const sequelize=require('./util/database');
const helmet=require('helmet');
const morgan=require('morgan');
const fs=require('fs');

const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/order');
const forgotpassword=require('./models/forgotpwdreq');
const fileurl=require('./models/fileurl');

const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
const purchaseRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premium');
const passwordRoute=require('./routes/password');

const app = express();

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

// app.use(helmet({contentSecurityPolicy: false})); 
app.use(morgan('combined',{stream:accessLogStream}));

app.use(cors());
  
app.use(bodyParser.json({ extended: false }));
 //app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);
app.use('/premium',premiumRoute);
app.use('/password',passwordRoute); 

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,`public/${req.url}`));
});

User.hasMany(Expense);
Expense.belongsTo(User);  
    
User.hasMany(Order);
Order.belongsTo(User);  

User.hasMany(forgotpassword);
forgotpassword.belongsTo(User); 

User.hasMany(fileurl);
fileurl.belongsTo(User); 

app.use(errorController.get404);

sequelize  
      .sync()
    // .sync({force:true})  
    .then(()=>app.listen(3100))
    .catch(err=>console.log(err));  