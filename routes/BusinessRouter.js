const express = require('express')
const passport = require('passport');
require('../config/passport')(passport);
const BusinessController = require('../Controllers/BusinessController.js')

const BusinessRouter = express.Router()
BusinessRouter.get('/Binfo',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.getBusinessInfo(req,res))
BusinessRouter.get('/events',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.viewEvents(req,res))
BusinessRouter.post('/createEvent',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.createEvent(req,res))
BusinessRouter.get('/event/:_id',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.oneEvent(req,res))
BusinessRouter.post('/event/edit/:_id',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.editEvent(req,res))
BusinessRouter.get('/event/delete/:_id',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.deleteEvent(req,res))
BusinessRouter.post('/Binfo/edit',passport.authenticate('Bjwt',{session: false}), (req,res) =>BusinessController.editBusinessInfo(req,res))



module.exports = BusinessRouter;