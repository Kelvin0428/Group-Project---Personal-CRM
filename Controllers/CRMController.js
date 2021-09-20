const mongoose = require('mongoose')
const { BusinessUser, Circle } = require('../models/db')
const PersonalUser = mongoose.model('PersonalUser')
const Friend = mongoose.model('Friend')
const Usernis = mongoose.model('Usernis')
const Connection = mongoose.model('Connection')
const Task = mongoose.model('Task')
const CompletedTask = mongoose.model('CompletedTask')


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
            fullName:req.body.nameGiven+" "+req.body.nameFamily,
            personalInfo:req.body
        })
        let people = await new Friend({
            id:usernis._id,
            accountType: 'notInSystem'
        })
        let user = await PersonalUser.findOne({userName:req.user.userName})
        await usernis.save()
        user.connections.cnis.push(people)
        await user.save()
        res.json(user.connections)
    }catch(err){
        console.log(err)
    }
}


// display all tasks for the user
const viewTask = async (req,res) =>{
    try{
        const user = await PersonalUser.findOne({userName:req.user.userName}).lean()
        const tasks = user.tasks
        res.json(tasks)
        console.log(tasks)
    }catch(err){
        console.log(err)
    }
}

// create the task and add to user's tasks array 
const createTask = async (req,res)=>{
    try{
        // created date is default of current time
        let task = await new Task({
            taskName:req.body.taskName,
            description: req.body.description,
            connectionID:req.body.id,
            status: 'incomplete'
        })
        let user = await PersonalUser.findOne({userName:req.user.userName}) 
        await user.tasks.push(task)
        await user.save()
        res.json(user.tasks)
        console.log(user.tasks)
    }catch(err){
        console.log(err)
    }
}


// show the single task
const oneTask = async (req,res)=>{
    try{
        let user = await PersonalUser.findOne({userName:req.user.userName}) 
        let task = user.tasks.find(({_id}) => _id == req.params._id)
        res.json(task)
        console.log(task)
    }catch(err){
        console.log(err)

    }
}

// update edited task 
const editTask = async (req,res)=>{
    try{
        let user = await PersonalUser.findOne({userName:req.user.userName})
        let task = user.tasks.find(({_id}) => _id == req.params._id)
        // only update properties that have values
        for(const property in req.body){
            if(req.body[property]){
                task[property] = req.body[property]
            }
        }
        await user.save()
        console.log(task)
        res.json(task)
    }catch(err){
        console.log(err)
    }
}


// remove the task from database
const removeTask = async (req,res)=>{
    try{
        let user = await PersonalUser.findOne({userName:req.user.userName})
        user.tasks.pull({_id:req.params._id})
        await user.save()
        console.log(user.tasks)
        res.json(user.tasks)
    }catch(err){
        console.log(err)
    }
}


// mark the task as complete
const completeTask = async (req,res)=>{
    try{
        let user = await PersonalUser.findOne({userName:req.user.userName})
        let task = user.tasks.find(({_id}) => _id == req.params._id)
        task.status = "completed"
        task.endDate = Date.now()
        let completeTask = await new CompletedTask({
            relatedConnection:task.connectionID,
            timeStamp:task.endDate
        })
        user.completedTask.push(completeTask)
        await user.save()
        console.log(task)
        res.json(task)

    }catch(err){
        console.log(err)
    }
}


const createCircle = async (req,res)=>{
    try{
        let user =  await PersonalUser.findOne({userName:req.user.userName}).lean()
        const circleConnection = new Connection({})
        let connection = user.connections
        for(var property in connection){
            let connectionList = connection[property]
            for(const val in connectionList){
                if(connectionList[val].tags && (connectionList[val].tags).includes(req.body.tag)){
                    circleConnection[property].push(connectionList[val])
                }
            }
        }
        let circle = new Circle({
            tag: req.body.tag,
            people: circleConnection,
            description: req.body.description,
            name: req.body.name
        })
        let userSave = await PersonalUser.findOne({userName:req.user.userName})
        userSave.circles.push(circle)
        userSave.save()
        console.log(userSave.circles)
        res.json(userSave.circles)
    }catch(err){
        console.log(err)
    }
}

const viewCircles = async (req,res) =>{
    try{
        let circles =  (await PersonalUser.findOne({userName:req.user.userName}).lean()).circles
        console.log(circles)
        res.json(circles)

    }catch(err){
        console.log(err)
    }
}

const oneCircle = async (req,res) =>{
    try{
        let circles = (await PersonalUser.findOne({userName:req.user.userName}).lean()).circles
        for(const circle of circles){
            if(circle._id == req.params.id){
                res.json(circle)
                console.log(circle)
            }else{
                console.log("can't find circle")
            }
        }
    }catch(err){
        console.log(err)
    }
}

const deleteCircle = async (req,res) =>{
    try{
        let user = await PersonalUser.findOne({userName:req.user.userName})
        let circle = user.circles.find(obj => obj.id == req.params.id)
        user.circles.pull(circle)
        user.save()
        console.log(user.circles)
        res.json(user.circles)
    }catch(err){
        console.log(err)
    }
}

const removeConnection = async (req,res) =>{
    try{
        let user = await PersonalUser.findOne({userName:req.user.userName}).lean()
        let people = user.circles.find(circle =>circle._id == req.params.id ).people
        for(obj in people){
            for(index in people[obj]){
                if(people[obj][index].id == req.body.id){
                    people[obj].splice(index,1)
                }
            }
        }
        let changedCircles = user.circles
        let userSave = await PersonalUser.findOneAndUpdate({userName:req.user.userName},{circles:changedCircles})
        await userSave.save()
        console.log(userSave.circles)
        res.json(userSave.circles)
    }catch(err){
        console.log(err)
    }
}


module.exports = {getPersonInfo,editPersonalInfo,
    viewConnections,createUsernis,getIdentity,viewTask,createTask,oneTask,editTask,removeTask,completeTask,
    createCircle,viewCircles,oneCircle,deleteCircle,removeConnection}