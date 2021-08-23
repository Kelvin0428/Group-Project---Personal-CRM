const mongoose = require("mongoose")

// define the User schema
const personalUserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    userName: {type: String, required: true},
    password: {type: String, required: true},
})


// compile the Schemas into Models
const User = mongoose.model('User', personalUserSchema)

module.exports = {User}; // make model available to other files