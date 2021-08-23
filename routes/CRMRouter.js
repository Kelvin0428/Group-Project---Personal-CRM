const express = require('express')
const CRMRouter = express.Router()

// place holder for processing routes through controller
CRMRouter.get('/', (req, res) => res.send(req))

module.exports = CRMRouter