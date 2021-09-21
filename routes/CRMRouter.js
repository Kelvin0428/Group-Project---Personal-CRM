// requiring express for implementation
const express = require('express')
const passport = require('passport');
require('../config/passport')(passport);
const expressValidator = require('express-validator')
const CRMController = require('../Controllers/CRMController.js')

const CRMRouter = express.Router()
CRMRouter.get('/Pinfo',passport.authenticate('jwt',{session: false}), (req,res) =>CRMController.getPersonInfo(req,res))
CRMRouter.post('/updateInfo',passport.authenticate('jwt',{session: false}),(req,res) =>CRMController.editPersonalInfo(req,res))
CRMRouter.get('/connections',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.viewConnections(req,res))
CRMRouter.post('/createUser',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.createUsernis(req,res))
CRMRouter.get('/userName',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.getIdentity(req,res))

CRMRouter.get('/tasks',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.viewTask(req,res))
CRMRouter.post('/createTask',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.createTask(req,res))
CRMRouter.get('/task/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.oneTask(req,res))
CRMRouter.post('/task/edit/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.editTask(req,res))
CRMRouter.get('/task/remove/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.removeTask(req,res))
CRMRouter.get('/task/complete/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.completeTask(req,res))

CRMRouter.post('/createCircle',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.createCircle(req,res))
CRMRouter.get('/circles',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.viewCircles(req,res))
CRMRouter.get('/circle/:id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.oneCircle(req,res))

CRMRouter.get('/circle/delete/:id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.deleteCircle(req,res))

CRMRouter.post('/circle/:id/removeConnection',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.removeConnection(req,res))

module.exports = CRMRouter