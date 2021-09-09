// requiring express for implementation
const express = require('express')
const passport = require('passport');
require('../config/passport')(passport);
const CRMController = require('../controllers/CRMController.js')

const CRMRouter = express.Router()
CRMRouter.get('/Pinfo',passport.authenticate('jwt',{session: false}), (req,res) =>CRMController.getPersonInfo(req,res))
CRMRouter.post('/updateInfo',passport.authenticate('jwt',{session: false}),(req,res) =>CRMController.editPersonalInfo(req,res))
CRMRouter.get('/connections',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.viewConnections(req,res))
CRMRouter.post('/createUser',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.createUsernis(req,res))
CRMRouter.get('/userName',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.getIdentity(req,res))

CRMRouter.get('/tasks',(req,res)=>CRMController.viewTask(req,res))
CRMRouter.post('/createTask',(req,res)=>CRMController.createTask(req,res))
CRMRouter.get('/task/:_id',(req,res)=>CRMController.oneTask(req,res))
CRMRouter.post('/task/edit/:_id',(req,res)=>CRMController.editTask(req,res))
CRMRouter.post('/task/remove/:_id',(req,res)=>CRMController.removeTask(req,res))
CRMRouter.get('/task/complete/:_id',(req,res)=>CRMController.completeTask(req,res))


module.exports = CRMRouter