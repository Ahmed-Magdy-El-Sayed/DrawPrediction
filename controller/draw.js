const path = require("path")
const { labels} = require("../common/utilts")
const fs = require("fs")
const constants = require("../common/constants")

module.exports = {
    getDrawingPage: (req, res)=>{
        res.render("draw", {user: req.session.user, labels: labels})
    },
    saveToRawData: (req, res)=>{
        fs.appendFileSync(path.join(__dirname, constants.INSOURCE_DIR, req.body.label+".ndjson"), JSON.stringify(req.body)+"\n")
        res.status(201).end()
    }
}