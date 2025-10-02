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
                if(!data._id || (data._id && !(data._id.match(/^[0-9a-fA-F]{24}$/)))){// no id or wrong id format
                    delete data._id;
                    data.timestamp = new Date().getTime();
                    return await new drawingModel(data).save();
                }
                return await drawingModel.findById(data._id).then(async drawing=>{
                    if(!drawing || (drawing && String(drawing.authorId) != String(data.authorId))){// not found or not the author
                        delete data._id;
                        data.timestamp = new Date().getTime();
                        return await new drawingModel(data).save();
                    }
                    // found and the author -> update
                    return await drawingModel.findByIdAndUpdate(drawing._id, 
                        {name: data.name, img: data.img, paths: data.paths, timestamp: new Date().getTime()}, 
                    {_id:1});
                })
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
