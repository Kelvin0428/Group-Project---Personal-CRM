const mongoose = require('mongoose')
const { BusinessUser, Circle, PersonalInfo } = require('../models/db')
const { PersonalUser } = require('../models/db');
const Friend = mongoose.model('Friend')
const Usernis = mongoose.model('Usernis')
const Connection = mongoose.model('Connection')
const Task = mongoose.model('Task')
const CompletedTask = mongoose.model('CompletedTask')
const Event = mongoose.model('Event')

const expressValidator = require('express-validator')
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
        const user = await PersonalUser.findOne({userName:req.user.userName}).lean()
        const connection = user.connections
        const data = []
        for(const group in connection){
            if(group == "cis"){
                const cis = []
                for(var person of connection[group]){
                    var friend = await PersonalUser.findOne({id:person.id})
                }
            }else if(group == "cnis"){
                const cnis = []
                for(var person of connection[group]){
                    var friend = await Usernis.findOne({_id:person.id})
                    cnis.push({
                        id:friend._id,
                        name: friend.fullName,
                        connectionScore: person.connectionScore
                    })
                }
                data.push(cnis)
            }else{
                const bc = []
                for(var person of connection[group]){
                    var friend = await BusinessUser.findOne({id:person.id})
                }
            }
        }
        res.json(data)
    }catch(err){
        console.log(err)
    }

}

const viewBusinessConnections = async (req,res) => {
    try{
        let user = await PersonalUser.findOne({userName: req.user.userName});
        let businessConnection = user.connections.bc;
        let output = [];
        console.log(businessConnection)
        for(let i=0;i<businessConnection.length;i++){
            let temp = await BusinessUser.findOne({_id: businessConnection[i].id});
            temp.password = null;
            output.push(temp);
            console.log(output)
        }
        res.json(output);
    }catch(err){
        console.log(err)
    }
}

const connectionProfile = async (req,res)=>{
    try{
        const unis = await Usernis.findOne({_id:req.params._id}).lean()
        const user = await PersonalUser.findOne({userName:req.user.userName}).lean()
        const connections = user.connections.cnis
        let data = {}
        for(var person of connections){
            if(person.id == req.params._id){
                data = Object.assign(person,unis)
                console.log(data)
            }
        }
        res.json(data)
    }catch(err){
        console.log(err)
    }
}


const editConnectionProfile = async (req,res) =>{
    try{
        const unis = await Usernis.findOne({_id:req.params._id})
        const user = await PersonalUser.findOne({userName:req.user.userName})
        const personalInfo = unis.personalInfo
        if(req.body.nameFamily){personalInfo.nameFamily = req.body.nameFamily}
        if(req.body.nameGiven){personalInfo.nameGiven = req.body.nameGiven}
        if(req.body.DOB){personalInfo.DOB = req.body.DOB}
        if(req.body.gender){personalInfo.gender = req.body.gender}
        if(req.body.address){personalInfo.address = req.body.address}
        if(req.body.description){personalInfo.description = req.body.description}
        if(req.body.phoneNo){personalInfo.phoneNo=req.body.phoneNo}
        unis.fullName = unis.personalInfo.nameGiven+" "+unis.personalInfo.nameFamily
        for(let friend of user.connections.cnis){
            if(friend.id == req.params._id){
                if(req.body.timeGoal){friend.timeGoal = req.body.timeGoal}
                if(req.body.timeType){friend.timeType = req.body.timeType}
                if(req.body.numGoal){friend.numGoal = req.body.numGoal}
            }
        }
        await unis.save()
        await user.save()
        res.json("edit successful")
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

const addBUser = async (req,res) =>{
    try{
        let BUser = await BusinessUser.findOne({name:req.body.name});
        let user = await PersonalUser.findOne({userName: req.user.userName})
        let people = await new Friend({
            id: BUser._id,
            accountType: 'business'
        })
        console.log(user)
        user.connections.bc.push(people);
        await user.save()
        res.json(user.connections)
    }catch(err){
        console.log(err)
    }
}

const search = async (req, res) => { 
	// validate the user input
	const validationErrors = expressValidator.validationResult(req)
	    if (!validationErrors.isEmpty() ) {
		    return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	    }
	    var query = {}
	    if (req.body.tag !== '') {
		    query["tag"] = {$regex: new RegExp(req.body.tag, 'i') }
	    }
	    try {
		    const nis = await PersonalUser.findOne({userName:req.user.userName})
            let clist = nis.connections.cnis;
            let islist = nis.connections.cis
            let reg = new RegExp(req.body.tag, 'i')
            console.log(reg);
            let outputnis = [];
            let idlist = [];
            let foundid = [];
            for(let i=0;i<clist.length;i++){
                idlist.push(clist[i].id);
                for(let j=0; j<clist[i].tags.length;j++){
                   if(reg.test(clist[i].tags[j])){
                        const found = await Usernis.findOne({_id: clist[i].id});
                        await outputnis.push({name:found.fullName, id:found._id, tag:clist[i].tags[j]});
                        foundid.push(JSON.stringify(found._id))
                        break;
                   }
                }
            }
            const indis = await Usernis.find().where('_id').in(idlist).exec();      
            for(let i=0;i<indis.length;i++){
                if(!foundid.includes(JSON.stringify(indis[i]._id)) && reg.test(indis[i].fullName)){
                    await outputnis.push({name:indis[i].fullName,id:indis[i]._id, tag:null});
                }
            }

            let outputis = [];
            idlist = [];
            foundid = [];

            for(let i=0;i<islist.length;i++){
                idlist.push(islist[i].id);
                for(let j=0; j<islist[i].tags.length;j++){
                   if(reg.test(islist[i].tags[j])){
                        const found = await Usernis.findOne({_id: islist[i].id});
                        await outputis.push({name:found.fullName, id:found._id, tag:islist[i].tags[j]});
                        foundid.push(JSON.stringify(found._id))
                        break;
                   }
                }
            }
            const nindis = await Usernis.find().where('_id').in(idlist).exec();      
            for(let i=0;i<nindis.length;i++){
                if(!foundid.includes(JSON.stringify(nindis[i]._id)) && reg.test(nindis[i].fullName)){
                    await outputis.push({name:nindis[i].fullName,id:nindis[i]._id, tag:null});
                }
            }
            res.send({inSystem:outputis,notInSystem:outputnis});
	    } catch (err) {
		    console.log(err)
	    }
}


const ISsearch = async (req,res) => {
	// validate the user input
	const validationErrors = expressValidator.validationResult(req)
	    if (!validationErrors.isEmpty() ) {
		    return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	    }
        var pquery = {}
        var bquery = {}
	    if (req.body.userName !== '') {
		    bquery["name"] = {$regex: new RegExp(req.body.name, 'i') }
            pquery["userName"] = {$regex: new RegExp(req.body.name, 'i') }
	    }
	    try {
		    const bu = await BusinessUser.find(bquery);
            const uis = await PersonalUser.find(pquery);
            let outputB = [];
            let outputU = []
            for(let i=0;i<bu.length;i++){
                outputB.push({id: bu[i]._id, name: bu[i].name});
            }
            for(let i=0;i<uis.length;i++){
                outputU.push({id: uis[i]._id, name:uis[i].userName});
            }
            res.send({Business:outputB, Personal:outputU})
        } catch (err) {
		    console.log(err)
	    }
}

// display all tasks for the user
const viewTask = async (req,res) =>{
    try{
        const user = await PersonalUser.findOne({userName:req.user.userName}).lean()
        const tasks = user.tasks
        res.json(tasks)

    }catch(err){
        console.log(err)
    }
}

// create the task and add to user's tasks array 
const createTask = async (req,res)=>{
    try{
        let task = await new Task({
            taskName:req.body.taskName,
            description: req.body.description,
            connectionID:req.body.connectionID,
            dueDate:req.body.dueDate,
            wantNotified:req.body.wantNotified,
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
        let completeTask = await new CompletedTask({
            relatedConnection:task.connectionID,
            timeStamp:task.dueDate
        })
        if(task.connectionID == null){
            completeTask.relatedConnection = null;
        }
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
                let connection = circle.people
                const data = []
                for(const group in connection){
                    if(group == "cis"){
                        const cis = []
                        for(var person of connection[group]){
                            var friend = await PersonalUser.findOne({id:person.id})
                        }
                    }else if(group == "cnis"){
                        const cnis = []
                        for(var person of connection[group]){
                            var friend = await Usernis.findOne({_id:person.id})
                            cnis.push({
                                id:friend._id,
                                name: friend.fullName
                            })
                        }
                        data.push(cnis)
                    }else{
                        const bc = []
                        for(var person of connection[group]){
                            var friend = await BusinessUser.findOne({id:person.id})
                        }
                    }
                }
                circle.people = data
                console.log(circle)
                res.json(circle)
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
        await PersonalUser.findOneAndUpdate({userName:req.user.userName},{circles:changedCircles})
        console.log(user.circles)
        res.json(user.circles)
    }catch(err){
        console.log(err)
    }
}

const searchQuery = async (req,res)=>{
    try{
    //----------------------------------------------------------------------
        let current = await PersonalUser.findOne({userName:req.user.userName})
        let friendo;
        let completedTasks = current.completedTask;
        for(let i=0;i<current.connections.cnis.length;i++){
            friendo = current.connections.cnis[i]
            console.log(friendo)
            let total = 0;
            let calcDate = new Date();
            let swi = 7;
            if (friendo.timeType == 'month'){
                swi = 30;
            }
            calcDate.setDate(calcDate.getDate() - friendo.timeGoal * swi);
            for(let j=0; j<completedTasks.length; j++){
                if(completedTasks[j].relatedConnection != null && completedTasks[j].relatedConnection.equals(friendo.id)){

                    console.log(calcDate);
                    console.log(completedTasks[j].timeStamp);
                    if(completedTasks[j].timeStamp > calcDate){
                        total += 1;
                    }
                }
            }
            for(let j=0;j<current.events.length;j++){
                let event = await Event.findOne({_id: current.events[j]});
                for(let k=0;k<event.attendee.cnis.length;k++){
                    console.log("-----------")
                    console.log(event);
                    if (event.eventDate > calcDate && event.attendee.cnis[k].id.equals(friendo.id)){
                        total += 1;
                        break;
                    }
                }
            }
            friendo.connectionScore = total* 100 / friendo.numGoal;
            current.connections.cnis[i].connectionScore = friendo.connectionScore;
            await current.save();
        }

//------------------------------------------------------------
        let user = await PersonalUser.findOne({userName:req.user.userName});
        let connectionis = user.connections.cis;
        let connectionnis = user.connections.cnis;
        // let businessis = user.connections.bc;
        let output = [];
        for(let i=0;i<connectionis.length;i++){
            let current = {id: connectionis[i].id, type:connectionis[i].accountType, name:null, description:null, connectionScore:connectionis[i].connectionScore};
            let ind = await PersonalUser.findOne({_id: connectionis[i].id});
            current.name = ind.personalInfo.nameGiven +" " +ind.personalInfo.nameFamily;
            current.description= ind.personalInfo.description;
            output.push(current);
        }
        for(let i=0;i<connectionnis.length;i++){
            let current = {id: connectionnis[i].id, type:connectionnis[i].accountType, name:null, description:null,connectionScore:connectionnis[i].connectionScore};
            let ind = await Usernis.findOne({_id: connectionnis[i].id});
            current.name = ind.fullName;
            current.description = ind.personalInfo.description;
            output.push(current);
        }
        res.json(output);
    }catch(err){
        console.log(err)
    }
}
const BsearchQuery = async (req,res)=>{
    try{
        let output = await BusinessUser.find();
        for(let i=0;i<output.length;i++){

            output[i].password = null

        }
        res.json(output);
    }catch(err){
        console.log(err)
    }
}

const createEvent = async (req,res) =>{
    try{
        const user = await PersonalUser.findOne({userName:req.user.userName})
        const event = new Event({
            eventDate:req.body.eventDate,
            description: req.body.description,
            eventName: req.body.eventName,
            eventAddress: req.body.eventAddress,
            host: user.personalInfo.nameGiven+" "+user.personalInfo.nameFamily,
            hostId:user._id,
            attendee: new Connection()
        })

        if(req.body.attendee){
            const unis = await Usernis.findOne({_id:req.body.attendee})
            unis.events.push(event._id)
            await unis.save()
            const cnis = user.connections.cnis
            for(var friend of cnis){
                if(friend.id.equals(req.body.attendee)){
                    event.attendee.cnis.push(friend)
                }
            }
        }
        await event.save()
        user.events.push(event._id)
        await user.save()
        // redirect to event page
        res.json("create successful")
    }catch(err){
        console.log(err)
    }
}



const viewEvents = async (req,res) =>{
    try{
        const user = await PersonalUser.findOne({userName:req.user.userName})
        const events = await Event.find({hostId:user._id})
        console.log(events)
        res.json(events)
    }catch(err){
        console.log(err)
    }
}

const oneEvent = async (req,res)=>{
    try{
        const event = await Event.findOne({_id:req.params._id}).lean()
        const people = event.attendee
        const attendees = []
        for(const group in people){
            if(group == "cnis"){
                const cnis = []
                for(var person of people[group]){
                    var friend = await Usernis.findOne({_id:person.id})
                    cnis.push({
                        id:friend._id,
                        name: friend.fullName
                    })
                }
                attendees.push(cnis)
            }
        }
        event.attendee = attendees
        res.json(event)
    }catch(err){
        console.log(err)
    }
}

const editEvent = async (req,res)=>{
    try{
        const event = await Event.findOne({_id:req.params._id})
        for(const property in req.body){
            if(req.body[property]){
                event[property] = req.body[property]
            }
        }
        await event.save()
        res.json(event)
    }catch(err){
        console.log(err)
    }
}

const deleteEvent = async (req,res)=>{
    try{
        const event = await Event.findOne({_id:req.params._id})
        const user = await PersonalUser.findOne({userName:req.user.userName})
        for(let eventID of user.events){
            if(eventID.equals(req.params._id)){
                user.events.pull(eventID)
            }
        }
        await user.save()
        for(let people of event.attendee.cnis){
            const unis = await Usernis.findOne(people.id)
            for(let eventID of unis.events){
                if(eventID.equals(req.params._id)){
                    unis.events.pull(eventID)
                    await unis.save()
                }
            }
        }

        await Event.findOneAndDelete({_id:req.params._id})
        //return to event page
        res.json("delete successful")
    }catch(err){
        console.log(err)
    }
}


const removeAttendee = async (req,res) =>{
    try{
        const event = await Event.findOne({_id:req.params._id})
        for(let people of event.attendee.cnis){
            if(req.body.id == people.id){
                event.attendee.cnis.pull(people)
            }
        }
        const unis = await Usernis.findOne({_id:req.body.id})
        for(let event of unis.events){
            if(event.equals(req.params._id)){
                unis.events.pull(event)
            }
        }
        await event.save()
        await unis.save()
        //redirect to event page
        res.json("remove successful")
    }catch(err){

    }
}

const addAttendee = async(req,res) =>{
    try{
        const event = await Event.findOne({_id:req.params._id})
        const user = await PersonalUser.findOne({userName:req.user.userName})
        for(let people of user.connections.cnis){
            if(people.id == req.body.id){
                event.attendee.cnis.push(people)
            }
        }
        const unis = await Usernis.findOne({_id:req.body.id})
        unis.events.push(event._id)
        
        await event.save()
        await unis.save()
        res.json("add successful")
    }catch(err){
        console.log(err)
    }
}


module.exports = {getPersonInfo,editPersonalInfo,
    viewConnections,connectionProfile,editConnectionProfile,createUsernis,getIdentity,viewTask,createTask,oneTask,editTask,removeTask,completeTask,
    createCircle,viewCircles,oneCircle,deleteCircle,removeConnection,search,ISsearch,searchQuery,createEvent,
    viewEvents,oneEvent,editEvent,deleteEvent,removeAttendee,addAttendee,BsearchQuery,addBUser,viewBusinessConnections}
