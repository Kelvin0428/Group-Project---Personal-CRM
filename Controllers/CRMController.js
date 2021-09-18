const mongoose = require('mongoose')
const PersonalUser = mongoose.model('PersonalUser')
const Friend = mongoose.model('Friend')
const Usernis = mongoose.model('Usernis')
const Connection = mongoose.model('Connection')

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
            let reg = new RegExp(req.body.tag, 'i')
            console.log(reg);
            let outputTag = [];
            let idlist = [];
            let outputName=[];
            let foundid = [];
            for(let i=0;i<clist.length;i++){
                idlist.push(clist[i].id);
                for(let j=0; j<clist[i].tags.length;j++){
                   if(reg.test(clist[i].tags[j])){
                        const found = await Usernis.findOne({_id: clist[i].id});
                        await outputTag.push({name:found.fullName, id:found._id, tag:clist[i].tags[j]});
                        foundid.push(JSON.stringify(found._id))
                        break;
                   }
                }
            }
            const indis = await Usernis.find().where('_id').in(idlist).exec();      
            for(let i=0;i<indis.length;i++){
                if(!foundid.includes(JSON.stringify(indis[i]._id)) && reg.test(indis[i].fullName)){
                    await outputName.push({name:indis[i].fullName,id:indis[i]._id});
                }
            }
            res.send({tag:outputTag,name:outputName});
	    } catch (err) {
		    console.log(err)
	    }
}

module.exports = {getPersonInfo,editPersonalInfo,viewConnections,createUsernis,getIdentity,search}