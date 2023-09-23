const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize=require('./util/database');
const app = express();

const User=require('./models/user');
const Expense=require('./models/expense');

app.use(cors());

const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
  
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute);
app.use('/expense',expenseRoute);

User.hasMany(Expense,{ foreignKey:'userId'});
Expense.belongsTo(User,{ foreignKey:'userId'});  
    
app.use(errorController.get404);

sequelize
        .sync()
    // .sync({force:true})  
    .then(()=>app.listen(3100))
    .catch(err=>console.log(err));  