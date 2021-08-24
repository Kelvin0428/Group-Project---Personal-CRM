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


const getPersonInfor = async (req,res) => {
    try{
        const user = await PersonalUser.find().lean()
        const newInfor = new Infor({
            nameFamily: "unimelb",
            nameGiven: "student"
        })
        user[0].personalInfor = newInfor 
        const infor = user[0].personalInfor
        res.send(infor)
        console.log(user)
    }catch(err){
        res.send(err)
        console.log(err)
    }
}

module.exports = {getAllConnectionsTest,getPersonInfor}