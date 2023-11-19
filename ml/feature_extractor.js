const constants = require("../common/constants");
const fs = require("fs");
const path = require("path");

const featuresCollector = require("../common/featuresCollector");
const { labels, generateImgFile, printProgress } = require("../common/utilts");

const createTraningTestingSamples = ()=>{
    // fs.writeFileSync(path.join(__dirname, constants.FEATURES_JSON), '{"featuresName": ["Width", "Height"], "samples": [');
    fs.writeFileSync(path.join(__dirname,constants.TRANING_SAMPLES), 'module.exports = {"featuresName": ["Width", "Height"], "samples": [');
    fs.writeFileSync(path.join(__dirname,constants.TESTING_SAMPLES), 'module.exports = {"featuresName": ["Width", "Height"], "samples": [');

    labels.forEach(label=>{
        //create features.json by seperate coordenates to seperated files in json folder and collect the objects with the rest attributes in feature.json file
        //create traning and testing samples by seperate each sample between traning and testing
        const samples = JSON.parse(fs.readFileSync(path.join(__dirname, constants.SAMPLES_DIR, label+"-samples.json")));
        console.log("adding and separetaing "+label+"...")
        let skipped = 0;
        samples.forEach((sample, i)=> {// add 2000 obj only with with width and hieght < 500
            if(i-skipped > 2000) return null
            const paths = JSON.parse(fs.readFileSync(path.join(__dirname, constants.JOSN_DIR, sample.key_id+".json")));
            sample.points=[
                parseFloat(featuresCollector.getWidth(paths).toFixed(3)),
                parseFloat(featuresCollector.getHeight(paths).toFixed(3))
            ]
            if (Math.max(...sample.points) > 500){
                skipped++
                return null;
            }
            /* //add to featrure file
            if(label == "tree" && i == samples.length-1)
                fs.appendFileSync(path.join(__dirname, constants.FEATURES_JSON),JSON.stringify(sample)+"]")
            else
                fs.appendFileSync(path.join(__dirname, constants.FEATURES_JSON),JSON.stringify(sample)+",")
             */
            //add to traning and testing files
            console.log("added objs:", i-skipped, "i:", i , "skipped:", skipped)
            if((i-skipped) < 1000 || ((i-skipped) == 1000 && label != "tree")){
                fs.appendFileSync(path.join(__dirname,constants.TESTING_SAMPLES),JSON.stringify(sample)+",")
            }else if((i-skipped) == 1000){
                fs.appendFileSync(path.join(__dirname,constants.TESTING_SAMPLES),JSON.stringify(sample)+"]")
            }else{
                if((i-skipped) < 2000 || ((i-skipped) == 2000 && label != "tree"))
                    fs.appendFileSync(path.join(__dirname,constants.TRANING_SAMPLES),JSON.stringify(sample)+",")
                else if((i-skipped) == 2000 && label == "tree")
                    fs.appendFileSync(path.join(__dirname,constants.TRANING_SAMPLES),JSON.stringify(sample)+"]")
            }
        })
        console.log("adding "+label+" done!")
    })
    fs.appendFileSync(path.join(__dirname, constants.TRANING_SAMPLES), "}")
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), "}")
    console.log("traning & testing samples collecting done!")
}
/* const featuresJsonToJs = ()=>{
    console.log("converting from json to js...")
    fs.writeFileSync(path.join(__dirname,constants.FEATURES_JS), "module.exports = ");
    fs.appendFileSync(path.join(__dirname,constants.FEATURES_JS), 
    fs.readFileSync(path.join(__dirname,constants.FEATURES_JSON))
    );
    console.log("converting done!")
} */

const traningSamples = require("../data/dataset/traningSamples").samples;
const testingSamples = require("../data/dataset/testingSamples").samples;
const { classify } = require("../common/utilts");
const createChartImage = require("../controller/chart")
const analysisObj = require("../controller/analysisResult")
let testingResult = {correct: 0, wrong: 0, all: 0}

const analyis= async ()=>{
    // testing the model
    testingSamples.forEach(sample => {
        const nearestLabel = classify(sample.points, traningSamples, 10)
        if(nearestLabel == sample.label){
            testingResult.correct++
            sample.predicted = nearestLabel
        }else
            testingResult.wrong++ 
        testingResult.all++
    });
    analysisObj.testingResult =  testingResult
    fs.writeFileSync(path.join(__dirname, constants.TESTING_SAMPLES), 'module.exports = {"featuresName": ["Width", "Height"], "samples": ')
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), JSON.stringify(testingSamples))
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), '}')
    // create chart of the traning samples
    analysisObj.chartImage = await createChartImage(500, 500)

    // calculate the confusion matrix
    analysisObj.confusionMatrix = {}
    labels.forEach(outerLabel=>{
        analysisObj.confusionMatrix[outerLabel] = {}
        labels.forEach(innerLabel=>{
            analysisObj.confusionMatrix[outerLabel][innerLabel] = 0
        })
    })
    traningSamples.forEach(sample=>{
        const realLabel = sample.label
        const predicatedLabel = classify(sample.points, traningSamples, 10)
        analysisObj.confusionMatrix[realLabel][predicatedLabel]++
    })
    fs.writeFileSync(path.join(__dirname, "..", "controller", "analysis.js"), "module.exports = "+JSON.stringify(analysisObj))
}

const generateImgs = (samples)=>{
    samples.forEach((drawing, i)=>{
        let paths = JSON.parse(fs.readFileSync(path.join(__dirname, constants.JOSN_DIR, drawing.key_id+".json")))
        const X = paths.flat().map(p=>p[0])
        const Y = paths.flat().map(p=>p[1])
        const maxX = Math.max(...X);
        const maxY = Math.max(...Y);
        const minX = Math.min(...X);
        const minY = Math.min(...Y);
        const shiftX = maxX >= 500  ? minX+10 : 0;
        const shiftY = maxY >= 500  ? minY+10 : 0;
        if(shiftX != 0 || shiftY != 0)
            paths = paths.map(strock=>
                strock.map( points=> [points[0]-shiftX, points[1]-shiftY])
            );
        generateImgFile(
            path.join(__dirname,constants.IMG_DIR, drawing.key_id+".png"), 
            paths
        )
        printProgress(i, samples.length)
    })
}

const scaleTraningTestingSamples = ()=>{
    console.log("scale testing samples...")
    const scale = 0.8;
    testingSamples.forEach(sample=>{
        sample.points = [
            parseFloat((sample.points[0]*scale).toFixed(3)), 
            parseFloat((sample.points[1]*scale).toFixed(3))
        ]
    })
    fs.writeFileSync(path.join(__dirname, constants.TESTING_SAMPLES), 'module.exports = {"featuresName": ["Width", "Height"], "samples": '+JSON.stringify(testingSamples)+'}')
    console.log("scale traning samples...")
    traningSamples.forEach(sample=>{
        sample.points = [
            parseFloat((sample.points[0]*scale).toFixed(3)), 
            parseFloat((sample.points[1]*scale).toFixed(3))
        ]
    })
    fs.writeFileSync(path.join(__dirname, constants.TRANING_SAMPLES), 'module.exports = {"featuresName": ["Width", "Height"], "samples": ')
    fs.appendFileSync(path.join(__dirname, constants.TRANING_SAMPLES), JSON.stringify(traningSamples))
    fs.appendFileSync(path.join(__dirname, constants.TRANING_SAMPLES), '}')
    console.log("updating done!")
}

// createTraningTestingSamples()
// scaleTraningTestingSamples()
// generateImgs(traningSamples)
generateImgs(testingSamples)
// analyis()
