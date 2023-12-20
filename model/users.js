const mongoose = require('mongoose');
const dbConnect = require('./dbConnect')
const bcrypt = require("bcrypt")

const uSchema = new mongoose.Schema({
    name: String,
    email: String,
    img:{type: String, default: "/user.jpg"},
    password: String
})

const usersModel = new mongoose.model('user',uSchema)

module.exports ={
    createUser: async data =>{//for signup 
        if(!(/^[0-9a-zA-Z_]{3,}$/g.test(data.name)))
            return "The name should be 3 or more of numbers, upper or lower characters, or underscore only"
        try {
            await bcrypt.hash(data.password, 10).then( val=>{
                data.password = val;
            })
            return await dbConnect(async ()=>{
                return await usersModel.findOne({ name: data.name }).then(async exist=>{
                    if(exist) return "the name is already used"
                    return await usersModel.findOne({ email: data.email }).then(async exist=>{
                        if(exist) return "the email is already used"
                        else {
                            await new usersModel(data).save()
                            return null
                        }
                    })
                })
            })
        } catch (err) {
            throw err
        }
    },
    authUser: async data =>{//for login 
        let user; 
        try {
            return dbConnect(async ()=>{
                if(data.nameOrEmail.includes("@"))
                    user = await usersModel.findOne({ email: data.nameOrEmail })
                else
                    user = await usersModel.findOne({ name: data.nameOrEmail })
                if(!user) return "there is no account match this name/email"
                else {
                    return await bcrypt.compare(data.password, user.password)// check the password
                    .then(async valid =>{
                        if(!valid) return "name/email and password are not matched"
                        delete user.password;
                        return user;
                    })
                }
            })
        } catch (err) {
            throw err
        }
    },
    deleteUser: async id=>{
        try {
            return await usersModel.findByIdAndDelete(id)
        } catch (err) {
            throw err
        }
    }
}