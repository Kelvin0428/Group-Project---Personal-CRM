require('dotenv').config()   
// requiring express for implementation
const express = require('express')
//requiring authroisation modules
const jwt = require('jsonwebtoken');
const passport = require('passport');
var nodemailer = require('nodemailer');
const AuthenController = require('../Controllers/AuthenController.js')
require('../config/passport')(passport);
//code inspiration drawn from applications developed from Web information Technologies 2021 sem 1
//setting up controller and router
const AuthenRouter = express.Router()

//handling login requests
AuthenRouter.post('/login', async (req, res, next) => {
    //utilises the Personallogin authentication method for personal users to log in 
    passport.authenticate('Personallogin', async (errors, Personaluser, message) => {
        try {
            // log information on authentication status -- 'login successful'

            // if Personallogin authentication has error
            if(errors || !Personaluser){
                return res.status(200).send(message)
            }
            //login to the user
            req.login(Personaluser, { session : false }, async (error) => {
                if(error){
                    return next(error);
                }
                const body = { _id : Personaluser.userName };
                //sign the token and allow it to expire in 6 hours
                const token = jwt.sign({ body },process.env.PASSPORT_KEY, {expiresIn: "6h"});
                //set the cookie
                res.cookie('jwt',token, { httpOnly: false, sameSite: false, secure: true, domain:"https://parallel-of-latitude.herokuapp.com/"});
                //set output as token and username
                const output = {token:token, userName:Personaluser.userName,nameGiven: Personaluser.personalInfo.nameGiven, nameFamily: Personaluser.personalInfo.nameFamily,isBusiness:false};
                return res.status(200).json(output);
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

//handling login requests
AuthenRouter.post('/Blogin', async (req, res, next) => {
    //utilises the Businesslogin authentication method for business users to log in 
    passport.authenticate('Businesslogin', async (errors, Businessuser, message) => {
        try {
                      // if Personallogin authentication has error
            if(errors || !Businessuser){
                return res.status(200).send(message)
            }
            console.log(Businessuser);
            //login to the user
            req.login(Businessuser, { session : false }, async (error) => {
                if(error){
                    return next(error);
                }
                const body = { _id : Businessuser.email };
                //sign the token and allow it to expire in 6 hours
                const token = jwt.sign({ body },process.env.PASSPORT_KEY, {expiresIn: "6h"});
                //set the cookie
                res.cookie('jwt',token, { httpOnly: false, sameSite: false, secure: true, domain:"https://parallel-of-latitude.herokuapp.com/"});
                //set output as token and username
                const output = {token:token, name:Businessuser.name,isBusiness:true};
                return res.status(200).json(output);
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

AuthenRouter.post('/Bsignup', async (req, res, next) => {
    //utilises the BUsinesslogin authentication method for business users to log in 
    passport.authenticate('Bsignup', async (errors, Businessuser, message) => {
        try {

            if(errors || !Businessuser){
                return res.status(200).send(message)
            }
            return res.status(200).send("Sign Up Successful")
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

AuthenRouter.get('/activate/:id', (req,res) => AuthenController.activateAccount(req,res));

AuthenRouter.post('/sendForget', (req,res)=>AuthenController.sendForget(req,res));

AuthenRouter.post('/forgetPassword/:id', (req,res) => AuthenController.forgetPassword(req,res));

AuthenRouter.get('/deleteAccount',passport.authenticate('jw'))
AuthenRouter.post('/resetPassword',passport.authenticate('jwt',{session: false}), (req,res)=> AuthenController.resetPassword(req,res));
//handling login requests
AuthenRouter.post('/signup', async (req, res, next) => {
    //utilises the Personallogin authentication method for personal users to log in 
    passport.authenticate('signup', async (errors, Personaluser, message) => {
        try {
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
                to: Personaluser.email,
                subject: 'Account Verification',
                //url here needs to be changed to front ends
                html: "<header style ='background-color:AliceBlue;'><h1 style='background-color:DeepSkyBlue; color:white'>Welcome to Polar Circle</h1><h2>Hi " + Personaluser.personalInfo.nameGiven + "</h2> <br><br><h3>Thank you for regestering a PolarCRM account. Please proceed with <a href='https://it-pol.herokuapp.com/activate/"+ Personaluser.secretID + "'> this link </a>to activate your account </h3><br><br> <small>This email address is not being monitored. Please do not reply to this email</small></header>"
            }

            //send the mail
            transporter.sendMail(mailDetails, function(error, info){
                if(error){
                    return res.status(200).send(message)
                }else{
                    console.log('Email sent')
                }
            })
            // if Personallogin authentication has error
            if(errors || !Personaluser){
                return res.status(200).send(message)
            }
            //return with successful message and FE can redirect to login page
            return res.status(200).send("Sign Up Successful")

         /*   // directly login to the user
            req.login(Personaluser, { session : false }, async (error) => {
                if(error){
                    return next(error);
                }
                const body = { user_name : Personaluser.userName };
                //sign the token and allow it to expire in 6 hours
                const token = jwt.sign({ body },process.env.PASSPORT_KEY, {expiresIn: "6h"});
                //set the cookie
                res.cookie('jwt',token, { httpOnly: false, sameSite: false, secure: true, domain:"http://localhost:8000"});
                return res.status(200).json(token);
            });*/
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

module.exports = AuthenRouter