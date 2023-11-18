const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const {featuresName, samples} = require("../data/dataset/traningSamples");
const { labelsStyles } = require('../common/utilts');
const featuresCollector = require('../common/featuresCollector');

const scatterDataset = [];
var oldLabel;
for (const sample of samples) {
    if(oldLabel == sample.label)
        scatterDataset[scatterDataset.length-1].data.push({x:sample.points[0], y:sample.points[1]})
    else{ 
        scatterDataset.push({
            label: sample.label,
            pointRadius: 1,
            pointBackgroundColor: labelsStyles[sample.label],
            data: [{x:(sample.points[0]), y:(sample.points[1])}]
        })
        oldLabel = sample.label
    }
}
module.exports = async (width, height, newPoint)=>{
    const canvasRenderService = new ChartJSNodeCanvas({width, height});
    if(newPoint){
        if(scatterDataset[scatterDataset.length-1].label == "newDraw")
                scatterDataset[scatterDataset.length-1].data = [newPoint]
        else
            scatterDataset.push({
                label: "newDraw", 
                pointRadius: 8,
                pointBackgroundColor: labelsStyles.newDraw,
                data: [newPoint]
            })
    }
    console.log("start creating the image")
    const configuration = {
        type: 'scatter',
        data: {
            datasets: scatterDataset
        },
        options: {
            scales: {
                x: {
                    max: 500
                },
                y: {
                    max: 500
                }
            }
        }
    }
    const dataUrl = await canvasRenderService.renderToDataURL(configuration);
    console.log("creating Image done")
    return dataUrl;
}