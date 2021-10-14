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
CRMRouter.get('/BusinessConnections',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.viewBusinessConnections(req,res))
CRMRouter.get('/connection/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.connectionProfile(req,res))
CRMRouter.post('/connection/edit/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.editConnectionProfile(req,res))
CRMRouter.get('/connection/remove/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.deleteConnection(req,res))
CRMRouter.post('/connection/addTag/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.addTag(req,res))


CRMRouter.post('/createUser',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.createUsernis(req,res))
CRMRouter.post('/addBUser',passport.authenticate('jwt',{session: false}),(req,res)=> CRMController.addBUser(req,res))
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

CRMRouter.post('/circle/:id/addConnection',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.addConnection(req,res))
CRMRouter.post('/circle/:id/removeConnection',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.removeConnection(req,res))

CRMRouter.post('/search', passport.authenticate('jwt',{session:false}),expressValidator.body('tag').isAlpha().optional({checkFalsy: true}),(req,res)=>CRMController.search(req,res))

CRMRouter.post('/ISsearch',passport.authenticate('Bjwt',{session:false}), expressValidator.body('name').isAlpha().optional({checkFalsy: true}),(req,res) => CRMController.ISsearch(req,res))

CRMRouter.get('/searchQuery',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.searchQuery(req,res))
CRMRouter.get('/calcConnection',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.calcConnection(req,res))
CRMRouter.get('/BusinessSearchQuery',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.BsearchQuery(req,res))
CRMRouter.post('/createEvent',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.createEvent(req,res))
CRMRouter.get('/events',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.viewEvents(req,res))
CRMRouter.get('/event/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.oneEvent(req,res))
CRMRouter.post('/event/edit/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.editEvent(req,res))
CRMRouter.get('/event/delete/:_id',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.deleteEvent(req,res))
CRMRouter.post('/event/:_id/removeAttendee',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.removeAttendee(req,res))
CRMRouter.post('/event/:_id/addAttendee',passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.addAttendee(req,res))

CRMRouter.get('/tags', passport.authenticate('jwt',{session: false}),(req,res)=>CRMController.getTags(req,res))
module.exports = CRMRouter