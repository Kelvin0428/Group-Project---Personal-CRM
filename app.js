//code inspiration drawn from applications developed and adapted from workshop programs from Web information Technologies 2021 sem 1
// require mongodb connectiong
require('./models/index.js')

// requiring nevessary modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()

require('./config/passport')(passport);


// assign constant to express app
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

app.use(cors({
  credentials: true, 
  //origin: "http://localhost:3000" 
  origin: "https://it-pol.herokuapp.com"
}));

app.use(session({ secret: process.env.PASSPORT_KEY,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());

app.use(passport.session());

//set up CRM routes
const CRMRouter = require('./routes/CRMRouter.js')
const AuthenRouter = require('./routes/AuthenRouter.js')
const BusinessRouter = require('./routes/BusinessRouter.js')
app.use('/', CRMRouter);
app.use('/authenticate',AuthenRouter)
app.use('/business',BusinessRouter);

app.all('*', (req, res) => {res.send('Invalid Route')})



var nodemailer = require('nodemailer');
const mongoose = require('mongoose')
const PersonalUser = mongoose.model('PersonalUser')
const cron = require('node-cron');

cron.schedule('* * * * *', async function(){
  const users = await PersonalUser.find();
  for(let i=0;i<users.length;i++){
    let tasks = users[i].tasks;
    console.log('new User');
    for(let j=0;j<tasks.length;j++){
      //tasks[j].wantNotify == true && tasks[j].isNotified == false && 
      console.log(tasks);
      if(tasks[j].status != 'completed'){
        console.log('new Task');
        console.log(tasks[j]);
  
        var currentTime = new Date();
        var endTime = tasks[j].dueDate;
        console.log(currentTime);
        console.log(tasks[j].dueDate);
        var timeDif = currentTime.getTime() - endTime.getTime();
        var daysDif = timeDif / (1000 * 3600 * 24);
        console.log(daysDif);
      }
    }
  }
})


// listening on Port address if active, or else on local host 8000
app.listen(process.env.PORT || 8000, () => {
  console.log("Connected")
})
