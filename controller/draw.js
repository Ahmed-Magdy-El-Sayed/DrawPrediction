const path = require("path")
const { labels} = require("../common/utilts")
const fs = require("fs")
const constants = require("../common/constants")

module.exports = {
    getDrawPage: (req,res)=>{
        res.render("draw", {labels: labels})
    },
    saveDraw: (req, res)=>{
        fs.appendFileSync(path.join(__dirname, constants.INSOURCE_DIR, req.body.label+".ndjson"), JSON.stringify(req.body)+"\n")
        res.status(201).end()
    }
}