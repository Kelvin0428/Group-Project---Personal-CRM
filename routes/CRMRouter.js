// requiring express for implementation
const express = require('express')
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport')(passport);
const CRMController = require('../Controllers/CRMController.js')
const CRMRouter = express.Router()

CRMRouter.get('/secure', passport.authenticate('jwt', { session: false }), (req, res) => CRMController.getAllConnectionsTest(req,res))

module.exports = CRMRouter