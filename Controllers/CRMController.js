const mongoose = require('mongoose')
const PersonalUser = mongoose.model('PersonalUser')
const Friend = mongoose.model('Friend')
const Usernis = mongoose.model('Usernis')
const Connection = mongoose.model('Connection')



const getAllConnectionsTest = async (req, res) => { 
	try {
		const Puser = await PersonalUser.find().lean()
        const newFriend = new Friend({
			id: Puser[0]._id,
            accountType: 'inSystem'
		})
        
        const newConnection = new Connection({
            cis:[]
        })
        await newConnection.cis.push(newFriend)
        Puser[0].connections = newConnection
		console.log(Puser[0])
        console.log(Puser[0].connections)
        console.log(Puser[0].connections.cis[0].accountType)
		res.send(Puser)	
	} catch (err) {
		console.log(err)
	}
}


const getPersonInfo = async (req,res) => {
    try{
        const user = await PersonalUser.findOne({userName:req.user.userName}).lean()
        res.json(user.personalInfo)
    }catch(err){
        console.log(err)
    }
}

const editPersonalInfo = async (req,res) =>{
    try{
        let user = await PersonalUser.findOne({userName:req.user.userName})
        const newInfo = req.body 
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

const viewConnections = async (req,res) => {
    try{
        const user = await PersonalUser.findOne({userName:req.user.userName})
        const connection = user.connections
        res.json(connection)
    }catch(err){
        console.log(err)
    }

}


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
        let user = await PersonalUser.findOne({userName:req.userName})
        usernis.save()
        user.connections.cnis.push(people)
        user.save()
        res.json(user)
    }catch(err){
        console.log(err)
    }
}


module.exports = {getAllConnectionsTest,getPersonInfo,editPersonalInfo,viewConnections,createUsernis}