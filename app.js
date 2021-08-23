//code inspiration drawn from applications developed from Web information Technologies 2021 sem 1
// require mongodb connectiong
require('./models/index.js')
// requiring nevessary modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// assign constant to express app
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.use(cors());

//set up CRM routes
const CRMRouter = require('./routes/CRMRouter.js')
app.use('/', CRMRouter);


app.all('*', (req, res) => {res.send('error')})


// listening on Port address if active, or else on local host 8000
app.listen(process.env.PORT || 8000, () => {
  console.log("FoodBuddy app is listening ...")
})
