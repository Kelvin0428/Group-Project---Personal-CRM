const mongoose = require('mongoose')
const PersonalUser = mongoose.model('PersonalUser')
const Friend = mongoose.model('Friend')
const Infor = mongoose.model('PersonalInfo')
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
        const user = await PersonalUser.findOne({"userName":"student"}).lean()
        res.send(user.personalInfo)
        console.log(user.personalInfo)
    }catch(err){
        res.send(err)
        console.log(err)
    }
}

const editPersonalInfo = async (req,res) =>{
    try{
        let user = await PersonalUser.findOne({"userName":"student"})
        console.log(user)
        const newInfo = req.body 
        for(const property in newInfo){
            if(newInfo[property]){
                user.personalInfo[property] = newInfo[property]
            }
        }
        console.log(user)
        await user.save()
        //console.log(newInfo)
        res.send(user)
    }catch(err){
        res.send(err)
        console.log(err)
    }
}

module.exports = {getAllConnectionsTest,getPersonInfo,editPersonalInfo}