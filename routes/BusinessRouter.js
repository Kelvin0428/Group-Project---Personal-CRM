const express = require('express')
const passport = require('passport');
require('../config/passport')(passport);
const BusinessController = require('../Controllers/BusinessController.js')

const BusinessRouter = express.Router()
BusinessRouter.get('/Binfo',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.getBusinessInfo(req,res))
BusinessRouter.get('/events',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.viewEvents(req,res))
BusinessRouter.get('/createEvent',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.createEvent(req,res))
BusinessRouter.get('/event/:_id',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.oneEvent(req,res))



module.exports = BusinessRouter;