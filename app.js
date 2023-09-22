const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error'); // Make sure this is the correct path to your error controller
const sequelize = require('./util/database');
const app = express();

app.use(cors());

const userRoute = require('./routes/user');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoute);

app.use(errorController.get404); // This should now work correctly

sequelize
    .sync()
    // .sync({force:true})
    .then(() => app.listen(3100))
    .catch(err => console.log(err));
