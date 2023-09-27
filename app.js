const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize=require('./util/database');
const app = express();

const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/order');
const forgotpassword=require('./models/forgotpwdreq');

app.use(cors());

const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
const purchaseRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premium');
const passwordRoute=require('./routes/password');
  
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);
app.use('/premium',premiumRoute);
app.use('/password',passwordRoute); 

User.hasMany(Expense);
Expense.belongsTo(User);  
    
User.hasMany(Order);
Order.belongsTo(User);  

User.hasMany(forgotpassword);
forgotpassword.belongsTo(User); 

app.use(errorController.get404);

sequelize 
      .sync()
    // .sync({force:true})  
    .then(()=>app.listen(3100))
    .catch(err=>console.log(err));  