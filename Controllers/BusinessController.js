const mongoose = require('mongoose')
const BusinessUser = mongoose.model('BusinessUser')
const Friend = mongoose.model('Friend')
const Usernis = mongoose.model('Usernis')
const Connection = mongoose.model('Connection')
const Event = mongoose.model('Event')
const expressValidator = require('express-validator')
const { PersonalUser } = require('../models/db')
// get Business information
const getBusinessInfo = async (req,res) => {
    try{
        const user = await BusinessUser.findOne({email:req.user.email}).lean()
        console.log(user)
        let temp = []
        for (let i=0;i<user.events.length;i++){
            temp.push(await Event.find({_id:user.events[i]}));
        }

        user.events = temp;
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
                    cis.push({
                        id:friend._id,
                        name:friend.personalInfo.nameGiven+" "+friend.personalInfo.nameFamily,
                    })
                }
                attendees.push(cis)
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
        const buser = await BusinessUser.findOne({email:req.user.email})
        for(let eventID of buser.events){
            if(eventID.equals(req.params._id)){
                buser.events.pull(eventID)
            }
        }
        await buser.save()
        if(event.attendee.cis){
            for(let people of event.attendee.cis){
                const cis = await PersonalUser.findOne(people.id)
                for(let eventID of cis.events){
                    if(eventID.equals(req.params._id)){
                        cis.events.pull(eventID)
                        await cis.save()
                    }
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


module.exports = {getBusinessInfo,createEvent,viewEvents,oneEvent,editEvent,deleteEvent,editBusinessInfo}
