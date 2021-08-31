// requiring express for implementation
const express = require('express')
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport')(passport);
const CRMController = require('../controllers/CRMController.js')
// place holder for processing routes through controller

const CRMRouter = express.Router()
CRMRouter.get('/Pinfo',passport.authenticate('jwt',{session: false}), (req,res) =>CRMController.getPersonInfo(req,res))
CRMRouter.post('/updateInfo',passport.authenticate('jwt',{session: false}),(req,res) =>CRMController.editPersonalInfo(req,res))
CRMRouter.get('/connections',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.viewConnections(req,res))
CRMRouter.post('/createUser',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.createUsernis(req,res))

CRMRouter.get('/secure', passport.authenticate('jwt', { session: false }), (req, res) => CRMController.getAllConnectionsTest(req,res))

module.exports = CRMRouter