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
            console.log(Personaluser);
            //login to the user
            req.login(Personaluser, { session : false }, async (error) => {
                if(error){
                    return next(error);
                }
                const body = { _id : Personaluser.userName };
                //sign the token and allow it to expire in 6 hours
                const token = jwt.sign({ body },process.env.PASSPORT_KEY, {expiresIn: "6h"});
                //set the cookie
                res.cookie('jwt',token, { httpOnly: false, sameSite: false, secure: true, domain:"http://localhost:8000"});
                //set output as token and username
                const output = {token:token, userName:Personaluser.userName,nameGiven: Personaluser.nameGiven, nameFamily: Personaluser.nameFamily};
                return res.status(200).json(output);
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

AuthenRouter.get('/activate/:id', (req,res) => AuthenController.activateAccount(req,res));

AuthenRouter.post('/sendForget', (req,res)=>AuthenController.sendForget(req,res));

AuthenRouter.post('/forgetPassword/:id', (req,res) => AuthenController.forgetPassword(req,res));

AuthenRouter.post('/resetPassword',passport.authenticate('jwt',{session: false}), (req,res)=> AuthenController.resetPassword(req,res));
//handling login requests
AuthenRouter.post('/signup', async (req, res, next) => {
    //utilises the Personallogin authentication method for personal users to log in 
    passport.authenticate('signup', async (errors, Personaluser, message) => {
        try {
            // log information on authentication status -- 'login successful'
            console.log(message);

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
                html: "<h1>Welcome to Polar Circle</h1><h2>Please proceed with the below link to activate your account</h2> <a href='http://localhost:8000/authenticate/activate/"+ Personaluser.secretID + "'>Activate</a> "
            }

            //send the mail
            transporter.sendMail(mailDetails, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Email sent:' + info.response)
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