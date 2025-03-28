const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

module.exports = cb=>{
    return new Promise(async (resolve, reject)=>{
        await mongoose.connect('mongodb://localhost:27017/drawing-prediction')//change database name here and in app.js to your database name
        .then(()=>{
            return cb()
            .then(resalt=>{
                resalt? resolve(resalt) : resolve();
            }).catch(err=>{
                console.error(err);
                reject()
            })
        })
        .catch(err=>{
            console.error(err)
            reject()
        })
    })
}