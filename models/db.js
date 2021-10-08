//for info on database structure, visit the uml model on Confluence
const mongoose = require("mongoose")
const bcrypt   = require('bcrypt-nodejs')
const Schema = mongoose.Schema

//information schema, for storing information that is not required, but is PI
const infoSchema = new mongoose.Schema({
    _id:false,
    nameFamily: {type: String},
    nameGiven: String,
    DOB: {type: String},
    gender: {type:String, enum:['Male','Female','Other']},
    address:{type: String}, 
    description:{type: String},
    phoneNo:{type: Number},
})

// schema for presenting all three types of user profile in one class
const friendSchema = new mongoose.Schema({
    _id:false,
    id: mongoose.Types.ObjectId,
    tags: [{type:String}],
    timeGoal:{type:Number,default:2},
    timeType:{type:String,enum:['week','month'],default:"week"},
    numGoal:{type:Number,default:1},
    connectionScore:{type:Number, default:0},
    accountType: {type:String, enum:['inSystem','notInSystem','business'],required:true}
})

//schema containing three arrays each for a different user profile
connectionSchema = new mongoose.Schema({
    _id:false,
    //connection in system
    cis: [friendSchema],
    //connection not in system
    cnis: [friendSchema],
    //business connection
    bc:[friendSchema]
})

//schema for storing tasks
const taskSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,auto:true},
    //what is the task name
    taskName: {type: String, required:true},
    connectionID: mongoose.Types.ObjectId,
    description:{type:String},
    createdDate: {type: Date, required: true,default:Date.now},
    dueDate: {type:Date,require:true},
    isNotified :{type:Boolean,default:false},
    wantNotified:{type:Boolean},
    status: {type: String, enum:['failed','incomplete','completed']},
    highlight:{type:Boolean, default:false}
})


//schema for events, including who hosted the event, who are the attendees
const eventSchema = new mongoose.Schema({
    eventDate: {type: Date, required:true},
    description:{type:String},
    eventName:{type:String},
    eventAddress:{type:String},
    host:{type:String},
    hostId: mongoose.Types.ObjectId,
    attendee: connectionSchema
})

//schema for grouping connections based on tags
const circleSchema = new mongoose.Schema({
    tag: String,
    people: connectionSchema,
    description: {type:String},
    name:{type:String, required:true, default:"Circle"}
})


const completedTaskSchema = new mongoose.Schema({
    relatedConnection: mongoose.Types.ObjectId,
    timeStamp: {type:Date}
})

// define the User schema
const personalUserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    userName: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    personalInfo: infoSchema,
    completedTask:[completedTaskSchema],
    connections: connectionSchema,
    tasks: [{type: taskSchema, default:null}],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' ,default:[]}],
    circles: [{type: circleSchema, default:null}],
    //active to decide if the account is verified and active
    active: {type: Boolean},
    //used to check if email verified is correct
    secretID: {type:String}
})

//define the business user schema
const businessUserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type:String, required:true, unique:true},
    description:{type:String},
    events:[{ type: Schema.Types.ObjectId, ref: 'Event' }],
    tasks:[taskSchema]
})

// define the users not in the system
const usernisSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,auto:true},
    fullName:{type:String,required:true},
    personalInfo: infoSchema,
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    circles: [{ type: Schema.Types.ObjectId, ref: 'Circle' }]
})


//hash password to provide security
personalUserSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

//hash password to compare and validate
personalUserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

//same but for business users
businessUserSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
businessUserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


// compile the Schemas into Models
const PersonalUser = mongoose.model('PersonalUser', personalUserSchema)
const BusinessUser = mongoose.model('BusinessUser', businessUserSchema)
const Circle = mongoose.model('Circle',circleSchema)
const Event = mongoose.model('Event',eventSchema)
const Task = mongoose.model('Task',taskSchema)
const Connection = mongoose.model('Connection',connectionSchema)
const Friend = mongoose.model('Friend',friendSchema)
const PersonalInfo = mongoose.model('PersonalInfo',infoSchema)
const Usernis = mongoose.model("Usernis",usernisSchema,"usernis")
const CompletedTask = mongoose.model("CompletedTask",completedTaskSchema)
module.exports = {PersonalUser,BusinessUser,Circle,CompletedTask,Event,Task,Connection,Friend,PersonalInfo,Usernis}; // make model available to other files
