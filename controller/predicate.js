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
        const point = featuresCollector.getWidthHeight(paths)
        
        const nearestLabel = classify.KNN(point, samples, 10)

        res.json({
            predictedLabel: nearestLabel
        })
    }, 
    getChart: async(req, res)=>{
        const {paths} = req.body;
        const pointArr = featuresCollector.getWidthHeight(paths);
        const point ={
            x: pointArr[0],
            y: pointArr[1]
        }
        res.json({chartImage: await createChartImage(500, 500, point)})
    }
}