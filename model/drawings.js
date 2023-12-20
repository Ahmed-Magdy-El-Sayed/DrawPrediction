const mongoose = require('mongoose');
const dbConnect = require('./dbConnect')

const drawingSchema = new mongoose.Schema({
    name: String,
    authorId: String,
    img: String,
    timestamp: String,
    paths: Array
})

const drawingModel = new mongoose.model('drawing',drawingSchema)

module.exports ={
    addDrawing: async data =>{
        try {
            return await dbConnect(async ()=>{
                return await drawingModel.findOne({ name: data.name }).then(async exist=>{
                    if(exist) return null
                    
                    data.timestamp = new Date().getTime()
                    return await new drawingModel(data).save()
                })
            })
        } catch (err) {
            throw err
        }
    },
    updateDrawing: async data =>{
        try {
            return await dbConnect(async ()=>{
                return await drawingModel.findByIdAndUpdate(data._id, 
                    {name: data.name, img: data.img, paths: data.paths, timestamp: new Date().getTime()}, 
                    {_id:1})
            })
        } catch (err) {
            throw err
        }
    },
    getDrawings: async authorId =>{
        try {
            return await dbConnect(async ()=>{
                return await drawingModel.find({authorId}, {paths:0})
            })
        } catch (err) {
            throw err
        }
    },
    getDrawing: async drawingId =>{
        try {
            return await dbConnect(async ()=>{
                return await drawingModel.findById(drawingId, {img: 0})
            })
        } catch (err) {
            throw err
        }
    },
    deleteDrawing: async id=>{
        try {
            return await drawingModel.findByIdAndDelete(id)
        } catch (err) {
            throw err
        }
    }
}
