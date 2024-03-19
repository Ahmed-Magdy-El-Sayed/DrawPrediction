const path = require("path")
const { labels} = require("../common/utilts")
const fs = require("fs")
const constants = require("../common/constants")
const {correct, all} = require("./analysisResult").testingResultANN
const drawingTypes = require("../common/utilts").labels.length

module.exports = {
    getHomePage:(req, res)=>{
        res.render("home", {
            user: req.session.user, 
            drawingsNum: all,
            accuracy: (correct/all*100).toFixed(2)+"%",
            drawingTypes
        })
    },
    getDrawingPage: (req, res)=>{
        res.render("contribute", {user: req.session.user, labels: labels})
    },
    saveToRawData: (req, res)=>{
        fs.appendFileSync(path.join(__dirname, constants.INSOURCE_DIR, req.body.label+".ndjson"), JSON.stringify(req.body)+"\n")
        res.status(201).end()
    }
}