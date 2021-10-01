const mongoose = require('mongoose')
const { PersonalUser } = require('../models/db');
var nodemailer = require('nodemailer');
var crypto = require("crypto");
// get user's personal information
const activateAccount = async (req,res) => {
    try{
        const user = await PersonalUser.findOneAndUpdate({secretID:req.params.id}, {active: false, secretID: null})
        
        res.send(user);
    }catch(err){
        console.log(err)
    }
}

const sendForget = async (req,res)=>{
    try{
        const user = await PersonalUser.findOne({email:req.body.email});
        if(!user){
            res.send('User is not found in system');
        }
        else if (user.active == false){
            res.send('Please verify email first');
        }else{
            user.secretID = crypto.randomBytes(16).toString('hex');
            await PersonalUser.findOneAndUpdate({_id:user._id},{secretID: user.secretID});
            // user.save();
            //set up node mailer transporter, allow for login in the sender email
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    user: 'polarcirclecrm@gmail.com',
                    pass: 'paralleloflatitude'
                }
            });
            //set up mail details, the recipient and content
            var mailDetails = {
                from: 'polarcirclecrm@gmail.com',
                to: user.email,
                subject: 'Forgot Password',
                //url here needs to be changed to front end's
                html: "<h1>Welcome to Polar Circle</h1><h2>Please proceed with the below link to reset your password</h2> <a href='http://localhost:3000/forget_reset/"+ user.secretID + "'>Reset password</a> "
            }

            //send the mail
            transporter.sendMail(mailDetails, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    res.send('Password reset email sent');
                    console.log('Email sent:' + info.response)
                }
            })
        }
    }catch(err){
        console.log(err)
    }
}

const forgetPassword = async (req,res)=>{
    try{
        const user = await PersonalUser.findOne({secretID:req.params.id})
        if(!user){
            res.send("Incorrect secret ID")
        }else{
            user.password = user.hashPassword(req.body.password);
            user.secretID = null;
            await PersonalUser.findOneAndUpdate({secretID: req.params.id},{password: user.password, secretID: null})
            res.send('Password reset Successful')
            
        }
    }catch(err){
        console.log(err)
    }
}

const resetPassword = async (req,res)=>{
    try{
        const user = await PersonalUser.findOne({userName: req.user.userName});
        if(!user){
            res.send("user name incorrect");
        }else if (user.validPassword(req.body.currentPassword)){
            user.password = user.hashPassword(req.body.newPassword);
            await user.save();
            res.send('reset password successful')
        }else{
            res.send("current password incorrect");
        }
    }catch(err){
        console.log(err)
    }
}
module.exports = {activateAccount,sendForget, forgetPassword, resetPassword}