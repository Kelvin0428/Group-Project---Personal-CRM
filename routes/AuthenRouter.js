require('dotenv').config()   
// requiring express for implementation
const express = require('express')
//requiring authroisation modules
const jwt = require('jsonwebtoken');
const passport = require('passport');
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
            console.log(message);
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
                res.cookie('jwt',token, { httpOnly: false, sameSite: false, secure: true, domain:"http://localhost:8000"});
                return res.status(200).json(token);
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

//handling login requests
AuthenRouter.post('/signup', async (req, res, next) => {
    //utilises the Personallogin authentication method for personal users to log in 
    passport.authenticate('signup', async (errors, Personaluser, message) => {
        try {
            // log information on authentication status -- 'login successful'
            console.log(message);
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