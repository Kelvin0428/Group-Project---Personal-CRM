//for info on database structure, visit the uml model on Confluence
const mongoose = require("mongoose")
const bcrypt   = require('bcrypt-nodejs')
const Schema = mongoose.Schema
//tag schema for creating tags for different connections
const tagSchema = new mongoose.Schema({
    _id:false,
    tagType:{type:String},
})

//information schema, for storing information that is not required, but is PI
const infoSchema = new mongoose.Schema({
    _id:false,
    nameFamily: {type: String},
    nameGiven: String,
    DOB: {type: Date},
    gender: {type:String, enum:['Male','Female','Other']},
    address:{type: String}, 
    description:{type: String},
    phoneNo:{type: Number},
})

// schema for presenting all three types of user profile in one class
const friendSchema = new mongoose.Schema({
    _id:false,
    id: mongoose.Types.ObjectId,
    tags: [tagSchema],
    timeGoal: {type:Number, default: null},
    timeType: {type:String, enum:['week','month']},
    numGoal: {type: Number},
    connectionScore:{type:Number},
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
    //what is the task name
    taskName: {type: String, required:true},
    connectionID: mongoose.Types.ObjectId,
    description:{type:String},
    createdDate: {type: Date, required: true},
    endDate: {type: Date},
    status: {type: String, enum:['draft','incomplete','completed']}
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
    tags: tagSchema,
    people: connectionSchema,
    description: {type:String},
    name:{type:String, required:true, default:"Circle"}
})

//schema for user profiles created by existing users for connections that are not using the crm
const createdUserSchema = new mongoose.Schema({
    personalInfo: infoSchema,
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    circles: [{ type: Schema.Types.ObjectId, ref: 'Circle' }]
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
    connections: connectionSchema,
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    completedTask: [completedTaskSchema],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    circles: [{ type: Schema.Types.ObjectId, ref: 'Circle' }],
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
    tasks:[{ type: Schema.Types.ObjectId, ref: 'Task' }]
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


const usernisSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId,auto:true},
    personalInfo: infoSchema,
    fullName: {type:String, required:true},
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    circles: [{ type: Schema.Types.ObjectId, ref: 'Circle' }]
})


// compile the Schemas into Models
const PersonalUser = mongoose.model('PersonalUser', personalUserSchema)
const BusinessUser = mongoose.model('BusinessUser', businessUserSchema)
const Circle = mongoose.model('Circle',circleSchema)
const CreatedUser = mongoose.model('CreatedUser',createdUserSchema)
const Event = mongoose.model('Event',eventSchema)
const Task = mongoose.model('Task',taskSchema)
const Connection = mongoose.model('Connection',connectionSchema)
const Friend = mongoose.model('Friend',friendSchema)
const PersonalInfo = mongoose.model('PersonalInfo',infoSchema)
const Tag = mongoose.model('Tag',tagSchema)
const Usernis = mongoose.model("Usernis",usernisSchema,"usernis")
module.exports = {PersonalUser,BusinessUser,Circle,CreatedUser,Event,Task,Connection,Friend,PersonalInfo,Tag,Usernis}; // make model available to other files