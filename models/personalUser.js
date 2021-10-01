const mongoose = require("mongoose");
const infoSchema = mongoose.model('PersonalInfo')
const completedTaskSchema = mongoose.model('CompletedTask')
const taskSchema = mongoose.model("Task")
const circleSchema = mongoose.model("Circle")
const Schema = mongoose.Schema

// define the User schema
const personalUserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    userName: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    personalInfo: infoSchema,
    completedTask:[completedTaskSchema],
    connections: connectionSchema,
    tasks: [{type: taskSchema, default:null}],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    circles: [{type: circleSchema, default:null}],
    //active to decide if the account is verified and active
    active: {type: Boolean},
    //used to check if email verified is correct
    secretID: {type:String}
})

const PersonalUser = mongoose.model('PersonalUser', personalUserSchema)