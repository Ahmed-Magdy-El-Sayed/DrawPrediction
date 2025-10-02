const mongoose = require("mongoose");
const crypto = require("crypto")
mongoose.set('strictQuery', false);

module.exports = cb=>{
    return new Promise(async (resolve, reject)=>{
        await mongoose.connect(process.env.MONGODB_URI)
        .then(()=>{
            return cb()
            .then(resalt=>{
                resalt? resolve(resalt) : resolve();
            })
        })
        .catch(err=>{
            console.error(err)
            reject()
        })
    })
}