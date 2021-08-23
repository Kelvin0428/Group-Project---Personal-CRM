const express = require('express')
const CRMRouter = express.Router()
const CRMController = require('../controllers/CRMController.js')
// place holder for processing routes through controller
CRMRouter.get('/', (req, res) => CRMController.getAllConnectionsTest(req,res))

module.exports = CRMRouter