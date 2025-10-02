const {labels} = require("../common/utilts")
const {correct, all} = require("./analysisResult").testingResultANN
const drawingsTypes = labels.length

module.exports = {
    getHomePage:(req, res)=>{
        res.render("home.pug", {
            user: req.session.user, 
            drawingsNum: all*2,
            accuracy: (correct/all*100).toFixed(2)+"%",
            drawingsTypes
        })
    }
}