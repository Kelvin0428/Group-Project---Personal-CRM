//code inspiration drawn from applications developed and workshop programs from Web information Technologies 2021 sem 1
// require .env for passcode
require('dotenv').config()    

//using the passport local strategy for passport.js
const LocalStrategy = require('passport-local').Strategy;

//importing data model for perosnal and business user for logins
const { PersonalUser } = require('../models/db');
const {BusinessUser} = require ('../models/db');

//JWT set up for authentication
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

module.exports = function(passport) {
    passport.use('jwt', new JwtStrategy({
        //allows for always extracting the token from the request header
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
        secretOrKey   : process.env.PASSPORT_KEY,
        passReqToCallback: true
    }, (req, jwt_payload, done) => {
        //find the user in the database
        PersonalUser.findOne({'email':jwt_payload.body._id}, (err, user) => {
            //error encountered with findOne
            if(err && !user){
                return done(err, false);
            }
            // user found 
            if(user){
                return done(null, user);
            }
        });
    }));


    //Passport for personal user to log in
    passport.use('Personallogin', new LocalStrategy({
        usernameField : 'userName',     // get email and password
        passwordField : 'password'
    }, async (userName, password, done) => {
        try {
            //Find user with the username
            await PersonalUser.findOne({ 'userName' :  userName }, function(err, user) {
                if (!user || password != user.password)
                //user not found in database or password incorrect
                    return done(null, false, {message: 'User not found or info incorrect'});
                else{
                    return done(null, user, {message: 'Login successful'});
                }
            });
        } catch (error) {
            return done(error);
        }
    }));
};