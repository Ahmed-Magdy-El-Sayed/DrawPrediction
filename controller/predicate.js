const {labelsStyles, classify} = require("../common/utilts");
const featuresCollector = require("../common/featuresCollector")
const {featuresName, samples} = require("../data/dataset/traningSamples");
const createChartImage = require("./chart")


module.exports = {
    getPredicatePage: (req, res)=>{
        res.render("prediction", {drawsStyles: labelsStyles})
    },
    predicateDraw: (req, res)=>{
        const {paths} = req.body
        const point =[
            featuresCollector.getNewWidth(paths),
            featuresCollector.getNewHeight(paths)
        ]
        
        const nearestLabel = classify(point, samples, 10)

        res.json({
            predictedLabel: nearestLabel
        })
    }, 
    getChart: async(req, res)=>{
        const {paths} = req.body;
        const point ={
            x: featuresCollector.getNewWidth(paths),
            y: featuresCollector.getNewHeight(paths)
        }
        res.json({chartImage: await createChartImage(500, 500, point)})
    }
}