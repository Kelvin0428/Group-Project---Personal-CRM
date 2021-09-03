const express = require('express')
const passport = require('passport');
const CRMRouter = express.Router()
const CRMController = require('../controllers/CRMController.js')

// place holder for processing routes through controller
CRMRouter.get('/Pinfo', passport.authenticate('jwt',{session: false}),(req,res) =>CRMController.getPersonInfo(req,res))
CRMRouter.post('/updateInfo',passport.authenticate('jwt',{session: false}),(req,res) =>CRMController.editPersonalInfo(req,res))
CRMRouter.get('/connections',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.viewConnections(req,res))
CRMRouter.post('/createUser',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.createUsernis(req,res))
module.exports = CRMRouter