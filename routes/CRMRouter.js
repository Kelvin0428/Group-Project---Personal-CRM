// requiring express for implementation
const express = require('express')
const passport = require('passport');
require('../config/passport')(passport);
const CRMController = require('../Controllers/CRMController.js')

const CRMRouter = express.Router()
CRMRouter.get('/Pinfo',passport.authenticate('jwt',{session: false}), (req,res) =>CRMController.getPersonInfo(req,res))
CRMRouter.post('/updateInfo',passport.authenticate('jwt',{session: false}),(req,res) =>CRMController.editPersonalInfo(req,res))
CRMRouter.get('/connections',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.viewConnections(req,res))
CRMRouter.post('/createUser',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.createUsernis(req,res))
CRMRouter.get('/userName',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.getIdentity(req,res))
module.exports = CRMRouter