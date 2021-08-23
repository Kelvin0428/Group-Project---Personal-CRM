const mongoose = require('mongoose')
const PersonalUser = mongoose.model('PersonalUser')
const Friend = mongoose.model('Friend')
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
module.exports = {getAllConnectionsTest}