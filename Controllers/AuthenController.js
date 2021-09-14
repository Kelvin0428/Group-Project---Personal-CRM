const mongoose = require('mongoose')
const PersonalUser = mongoose.model('PersonalUser')

// get user's personal information
const activateAccount = async (req,res) => {
    try{
        const user = await PersonalUser.findOne({secretID:req.params.id})
        if(user.active == false){
            user.active = true;
            await user.save();
        }
        res.send(user);
    }catch(err){
        console.log(err)
    }
}

module.exports = {activateAccount}