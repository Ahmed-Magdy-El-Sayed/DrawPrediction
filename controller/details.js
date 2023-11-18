const analysis = require("./analysis")
module.exports = {
    getDetailsPage: async (req, res)=>{
        res.render("details", {testingResult: analysis.testingResult, chartImage: analysis.chartImage, matrix: analysis.confusionMatrix})
    }
}