const mongoose = require('mongoose')
const PersonalUser = mongoose.model('PersonalUser')
const Friend = mongoose.model('Friend')
const Usernis = mongoose.model('Usernis')
const Connection = mongoose.model('Connection')
const Task = mongoose.model('Task')


// get user's personal information
const getPersonInfo = async (req,res) => {
    try{
        const user = await PersonalUser.findOne({userName:req.user.userName}).lean()
        res.json(user.personalInfo)
    }catch(err){
        console.log(err)
    }
}

// get user name for front end access
const getIdentity = async (req,res) =>{
    try{
        res.json(req.user.userName)
    }catch(err){
        console.log(err)
    }

}

// change personal information 
const editPersonalInfo = async (req,res) =>{
    try{
        let user = await PersonalUser.findOne({userName:req.user.userName})
        const newInfo = req.body 
        // only change information that has been modified
        for(const property in newInfo){
            if(newInfo[property]){
                user.personalInfo[property] = newInfo[property]
            }
        }
        await user.save()
        res.json(user.personalInfo)
    }catch(err){
        console.log(err)
    }
}

// get the connection
const viewConnections = async (req,res) => {
    try{
        const user = await PersonalUser.findOne({userName:req.user.userName})
        const connection = user.connections
        res.json(connection)
    }catch(err){
        console.log(err)
    }

}

// create a user whose not in system and add to connections
const createUsernis = async (req,res) => {
    try{
        let usernis = await new Usernis({
            personalInfo:req.body
        })
        let people = await new Friend({
            id:usernis._id,
            tags:[],
            accountType: 'notInSystem'
        })
        let user = await PersonalUser.findOne({userName:req.user.userName})
        await usernis.save()
        user.connections.cnis.push(people)
        await user.save()
        res.json(user)
    }catch(err){
        console.log(err)
    }
}


const viewTask = async (req,res) =>{
    try{
        const user = await PersonalUser.findOne({userName:"frank"}).lean()
        const tasks = user.tasks
        res.json(tasks)
        console.log(tasks)
    }catch(err){
        console.log(err)
    }
}

const createTask = async (req,res)=>{
    try{
        let task = await new Task({
            taskName:req.body.taskName,
            description: req.body.description,
            status: 'draft'
        })
        let user = await PersonalUser.findOne({userName:"frank"})
        await user.tasks.push(task)
        await user.save()
        res.json(user)
    }catch(err){
        console.log(err)
    }
}

const oneTask = async (req,res)=>{
    try{
        let user = await PersonalUser.findOne({userName:"frank"})
        let task = user.tasks.find(({_id}) => _id == req.params._id)
        res.json(task)
        console.log(task)
    }catch(err){
        console.log(err)

    }
}

const editTask = async (req,res)=>{
    try{
        let user = await PersonalUser.findOne({userName:"frank"})
        let task = user.tasks.find(({_id}) => _id == req.params._id)
        for(const property in req.body){
            if(req.body[property]){
                task[property] = req.body[property]
            }
        }
        await user.save()
        console.log(user)
        res.json(user)
    }catch(err){
        console.log(err)
    }
}

const removeTask = async (req,res)=>{
    try{
        let user = await PersonalUser.findOne({userName:"frank"})
        let task = user.tasks.pull({_id:req.params._id})
        await user.save()
        console.log(user)
        res.json(user)
    }catch(err){
        console.log(err)
    }
}

const completeTask = async (req,res)=>{
    try{
        let user = await PersonalUser.findOne({userName:"frank"})
        let task = user.tasks.find(({_id}) => _id == req.params._id)
        task.status = "completed"
        await user.save()
        console.log(task)
        res.json(task)

    }catch(err){
        console.log(err)
    }

}


module.exports = {getPersonInfo,editPersonalInfo,
    viewConnections,createUsernis,getIdentity,viewTask,createTask,oneTask,editTask,removeTask,completeTask}