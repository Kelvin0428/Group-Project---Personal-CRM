const mongoose = require('mongoose')
const BusinessUser = mongoose.model('BusinessUser')
const Friend = mongoose.model('Friend')
const Usernis = mongoose.model('Usernis')
const Connection = mongoose.model('Connection')

const expressValidator = require('express-validator')
// get Business information
const getBusinessInfo = async (req,res) => {
    try{
        const user = await BusinessUser.findOne({email:req.user.email}).lean()
        res.json(user);
    }catch(err){
        console.log(err)
    }
}

const editBusinessInfo = async (req,res) =>{
    try{
        let buser = await BusinessUser.findOne({email:req.user.email})
        if(req.body.name){buser.name=req.body.name}
        if(req.body.description){buser.description=req.body.description}
        await buser.save()
        res.json(buser)
    }catch(err){
        console.log(err)
    
    }
}


const createEvent = async (req,res) =>{
    try{
        const buser = await BusinessUser.findOne({email:req.user.email})
        const event = new Event({
            eventDate:req.body.eventDate,
            description: req.body.description,
            eventName: req.body.eventName,
            eventAddress: req.body.eventAddress,
            host: buser.name,
            hostId: buser._id,
            attendee: new Usernis()
        })

        await event.save()
        buser.events.push(event._id)
        await buser.save()
        // redirect to event page
        res.json("create successful")
    }catch(err){
        console.log(err)
    }
}


const viewEvents = async (req,res) =>{
    try{
        const buser = await BusinessUser.findOne({email:req.user.email})
        const events = await Event.find({hostId:buser._id})
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
            if(group == "cis"){
                const cis = []
                for(var person of people[group]){
                    var friend = await PersonalUser.findOne({id:person.id})
                }
            }else if(group == "cnis"){
                const cnis = []
                for(var person of people[group]){
                    var friend = await Usernis.findOne({_id:person.id})
                    cnis.push({
                        id:friend._id,
                        name: friend.fullName
                    })
                }
                attendees.push(cnis)
            }else{
                const bc = []
                for(var person of people[group]){
                    var friend = await BusinessUser.findOne({id:person.id})
                }
            }
        }
        event.attendee = attendees
        res.json(event)
    }catch(err){
        console.log(err)
    }
}


module.exports = {getBusinessInfo,createEvent,viewEvents,oneEvent,editBusinessInfo}