const analysis = require("./analysisResult")

let testingSamples = require("../data/dataset/testingSamples").samples
testingSamples = testingSamples.map(({key_id, label, predicted})=>{return {key_id, label, predicted}})

module.exports = {
    getAnalysisPage: async (req, res)=>{
        res.render("analysis", {testingResult: analysis.testingResult, chartImage: analysis.chartImage, matrix: analysis.confusionMatrix})
    },
    getTestedSamples: (req,res)=>{
        res.status(200).json(testingSamples)
    }
}