const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize=require('./util/database');
const app = express();

app.use(cors());

const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
  
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
 
app.use(errorController.get404);

sequelize
        .sync()
    // .sync({force:true})
    .then(()=>app.listen(3100))
    .catch(err=>console.log(err));  