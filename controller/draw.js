const path = require('path')
const fs =require("fs")

module.exports = {
    getDrawPage: (req,res)=>{
        res.sendFile(path.resolve(__dirname,'..','web','draw.html'));
    },
    saveDraw: (req, res)=>{
        const data = JSON.parse(req.body)
        fs.appendFileSync(path.join(__dirname, '..', 'data', 'dataset', 'ndjson', data.word+'.ndjson'), req.body)
        res.status(201).end()
    }
}