const express = require('express')
const passport = require('passport');
require('../config/passport')(passport);
const BusinessController = require('../Controllers/BusinessController.js')

const BusinessRouter = express.Router()
BusinessRouter.get('/Binfo',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.getBusinessInfo(req,res))

module.exports = BusinessRouter;