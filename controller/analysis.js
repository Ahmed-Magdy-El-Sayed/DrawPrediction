const analysis = require("./analysisResult")

/* let testingSamples = require("../data/dataset/testingSamples").samples
testingSamples = testingSamples.map(({key_id, label, predicted})=>{return {key_id, label, predicted}}) */

module.exports = {
    getAnalysisPage: async (req, res)=>{
        res.render("analysis", {
            user: req.session.user,
            testingResult: analysis.testingResultANN, 
            matrix: analysis.confusionMatrixANN
        })
    },
    /* getTestedSamples: (req,res)=>{
        res.status(200).json(testingSamples)
    } */
}