const mongoose = require('mongoose')
const BusinessUser = mongoose.model('BusinessUser')
const Friend = mongoose.model('Friend')
const Usernis = mongoose.model('Usernis')
const Connection = mongoose.model('Connection')

const expressValidator = require('express-validator')
// get Business information
const getBusinessInfo = async (req,res) => {
    try{
        console.log(req.user.email);
        const user = await BusinessUser.findOne({email:req.user.email}).lean()
        console.log(user)
        res.json(user);
    }catch(err){
        console.log(err)
    }
}

module.exports = {getBusinessInfo}