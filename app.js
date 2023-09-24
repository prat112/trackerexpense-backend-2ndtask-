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

app.use(cors());

const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
const purchaseRoute=require('./routes/purchase');
  
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);  
    
User.hasMany(Order);
Order.belongsTo(User);  

app.use(errorController.get404);

sequelize 
      .sync()
    // .sync({force:true})  
    .then(()=>app.listen(3100))
    .catch(err=>console.log(err));  