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


// listening on Port address if active, or else on local host 8000
app.listen(process.env.PORT || 8000, () => {
  console.log("Connected")
})
