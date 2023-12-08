const constants = require("../common/constants");
const fs = require("fs");
const path = require("path");

const { labels, features, printProgress, classify } = require("../common/utilts");

const createTraningTestingSamples = ()=>{
    // fs.writeFileSync(path.join(__dirname, constants.FEATURES_JSON), '{"featuresName": ["Width", "Height"], "samples": [');
    fs.writeFileSync(path.join(__dirname,constants.TRANING_SAMPLES), 'module.exports = {"featuresName": ["Width", "Height"], "samples": [');
    fs.writeFileSync(path.join(__dirname,constants.TESTING_SAMPLES), 'module.exports = {"featuresName": ["Width", "Height"], "samples": [');

    labels.forEach(label=>{
        //create features.json by seperate coordenates to seperated files in json folder and collect the objects with the rest attributes in feature.json file
        //create traning and testing samples by seperate each sample between traning and testing
        const samples = JSON.parse(fs.readFileSync(path.join(__dirname, constants.SAMPLES_DIR, label+"-samples.json")));
        console.log("adding and separetaing "+label+"...")
        samples.forEach((sample, i)=> {
            /*  ------------------- NO Need For Features File For Now As I Use Traning And Testing Files -------------------
            //add to featrure file
            if(label == "tree" && i == samples.length-1)
                fs.appendFileSync(path.join(__dirname, constants.FEATURES_JSON),JSON.stringify(sample)+"]")
            else
                fs.appendFileSync(path.join(__dirname, constants.FEATURES_JSON),JSON.stringify(sample)+",")
             */
            
            //add to traning and testing files
            if(i < (samples.length-1)/2 || (i == (samples.length-1)/2 && label != "tree")){
                fs.appendFileSync(path.join(__dirname,constants.TESTING_SAMPLES),JSON.stringify(sample)+",")
            }else if(i == (samples.length-1)/2){
                fs.appendFileSync(path.join(__dirname,constants.TESTING_SAMPLES),JSON.stringify(sample)+"]")
            }else{
                if(i < samples.length-1 || (i == samples.length-1 && label != "tree"))
                    fs.appendFileSync(path.join(__dirname,constants.TRANING_SAMPLES),JSON.stringify(sample)+",")
                else if(i == samples.length-1 && label == "tree")
                    fs.appendFileSync(path.join(__dirname,constants.TRANING_SAMPLES),JSON.stringify(sample)+"]")
            }
        })
        console.log("adding "+label+" done!")
    })
    fs.appendFileSync(path.join(__dirname, constants.TRANING_SAMPLES), "}")
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), "}")
    console.log("traning & testing samples collecting done!")
}
/*  ------------------- NO Need for features For Now -------------------
const featuresJsonToJs = ()=>{
    console.log("converting from json to js...")
    fs.writeFileSync(path.join(__dirname,constants.FEATURES_JS), "module.exports = ");
    fs.appendFileSync(path.join(__dirname,constants.FEATURES_JS), 
    fs.readFileSync(path.join(__dirname,constants.FEATURES_JSON))
    );
    console.log("converting done!")
} */

const traningSamples = require("../data/dataset/traningSamples").samples;
const testingSamples = require("../data/dataset/testingSamples").samples;
const createChartImage = require("../controller/chart")
const analysisObj = require("../controller/analysisResult");
const featuresCollector = require("../common/featuresCollector");
const {roundness} = require("../common/geometry");
const NeuralNetwork = require("../common/neuralNetwork");

let testingResult = {correct: 0, wrong: 0, all: testingSamples.length}

const analyis= async ()=>{
    // testing the model
    console.log("testing model...")
    traningSamples.forEach(sample => {
        const pLabel = classify.NN(sample.point)
        if(pLabel == sample.label)
            testingResult.correct++
        else
            testingResult.wrong++ 
            
        sample.predicted = pLabel
    });
    console.log(testingResult.correct + "/" + testingResult.all, testingResult.correct*100 / testingResult.all + "%" )
    
    analysisObj.testingResultANN =  testingResult
    // add predicted labels
    fs.writeFileSync(path.join(__dirname, constants.TESTING_SAMPLES), `module.exports = {"featuresName": ${JSON.stringify(features)}, "samples": `)
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), JSON.stringify(testingSamples))
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), '}')
    /* 
    // create chart of the traning samples
    console.log("creating a chart...")
    analysisObj.chartImage = await createChartImage(500, 500)
 */
    // calculate the confusion matrix
    console.log("creating the confusion matrix...")
    analysisObj.confusionMatrixANN = {}
    labels.forEach(outerLabel=>{
        analysisObj.confusionMatrixANN[outerLabel] = {}
        labels.forEach(innerLabel=>{
            analysisObj.confusionMatrixANN[outerLabel][innerLabel] = 0
        })
    })
    testingSamples.forEach(sample=>{
        const real = sample.label
        const predicted = sample.predicted
        analysisObj.confusionMatrixANN[real][predicted]++
    })
    fs.writeFileSync(path.join(__dirname, "..", "controller", "analysisResult.js"), "module.exports = "+JSON.stringify(analysisObj))
    console.log("analysis done!") 
}

//------------------- NO Need for Scaling The Data For Now -------------------
const updateTraningTestingSamples = ()=>{ 
        // const scale = 0.8;

    console.log("updating traning samples...")
    traningSamples.forEach((sample, i)=>{
        const paths = JSON.parse(fs.readFileSync(path.join(__dirname,constants.JOSN_DIR, sample.key_id+".json")));
        sample.point = Object.values(featuresCollector.getPixels(paths, 20))
        // const _2d = featuresCollector.getWidthHeight(paths)
        /* 
        sample.point[0] = featuresCollector.getWidthAxis(paths)
        sample.point[1] = featuresCollector.getHeightAxis(paths) 
        sample.point = [
            parseFloat((sample.point[0]*scale).toFixed(3)), 
            parseFloat((sample.point[1]*scale).toFixed(3))
        ] 
        sample.point = [featuresCollector.getWidthAxis(paths), featuresCollector.getHeightAxis(paths)]
        sample.point.push(featuresCollector.getElongation(paths))
        sample.point.push(featuresCollector.roundness(paths))
        sample.point.push(featuresCollector.getComplexity(paths))
        */
        printProgress(i+1, traningSamples.length)
    })
    fs.writeFileSync(path.join(__dirname, constants.TRANING_SAMPLES), `module.exports = {"featuresName": ${JSON.stringify(Array(traningSamples[0].point.length).fill(" "))}, "samples": `)
    fs.appendFileSync(path.join(__dirname, constants.TRANING_SAMPLES), JSON.stringify(traningSamples))
    fs.appendFileSync(path.join(__dirname, constants.TRANING_SAMPLES), '}')
    // 1-(Math.tanh(x)**2)
    console.log("updating testing samples...")
    testingSamples.forEach((sample, i)=>{
        const paths = JSON.parse(fs.readFileSync(path.join(__dirname,constants.JOSN_DIR, sample.key_id+".json")));
        sample.point = Object.values(featuresCollector.getPixels(paths, 20))
        // const WidthHeight = featuresCollector.getWidthHeight(paths)
        /*
        sample.point[0] = featuresCollector.getWidthAxis(paths)
        sample.point[1] = featuresCollector.getHeightAxis(paths)
        sample.point = [
            parseFloat((sample.point[0]*scale).toFixed(3)), 
            parseFloat((sample.point[1]*scale).toFixed(3))
        ] 
        sample.point = [featuresCollector.getWidthAxis(paths), featuresCollector.getHeightAxis(paths)]
        sample.point.push(featuresCollector.getElongation(paths))
        sample.point.push(featuresCollector.roundness(paths))
        sample.point.push(featuresCollector.getComplexity(paths))
        */
        printProgress(i+1, testingSamples.length)
    })
    fs.writeFileSync(path.join(__dirname, constants.TESTING_SAMPLES), `module.exports = {"featuresName": ${JSON.stringify(Array(testingSamples[0].point.length).fill(" ").toString())}, "samples": `)
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), JSON.stringify(testingSamples))
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), '}')
    console.log("updating done!")
}
let test = true;
const upgradeNetwork = (tries = 1)=>{
    let bestNetwork ;
    let bestAccuracy = 0;
    let updated = false
    let network
    const labelsCount = labels.length;
    if(fs.existsSync(path.join(__dirname, "..", "ml", "NNModel.js"))){
        const model = require("./NNModel");
        network = model.network;
        bestAccuracy = model.accuracy
    }else
        network = new NeuralNetwork([features.length, 10, 10, labelsCount]);

    for(let t = 1; t <= tries; t++){
        let correct = 0;
        let all = 0;
        traningSamples.forEach(sample => {
            const pLabel = classify.NN(sample.point, network)
            if(pLabel == sample.label)
                correct++
            
            const WsUpdate = {};
            const BsUpdate = {};
            for(let i = 0; i < labelsCount; i++){
                const LastOutputI = labels.indexOf(sample.label)
                const LastOutput = network.levels.slice(-1)[0].outputs[i]
                const dErr = 2 * (LastOutput - (LastOutputI == i? 1 : 0))
                const dLastAct = 1 - Math.tanh(LastOutput)**2
                const levelsCount = network.levels.length
                for(let j = levelsCount-1; j >= 0; j--){
                    const level = network.levels[j];
                    const middelLevels = (levelsCount-1) - j;
                    const inputsCount = level.inputs.length;
                    for(let k = inputsCount-1 ; k >= 0 ; k--){
                        if(i == 0){
                            if(WsUpdate[j])
                                WsUpdate[j].push([])
                            else
                                WsUpdate[j]= [[]];

                            if(!BsUpdate[j])
                                BsUpdate[j]= [];
                        }
                        const outputsCount = level.outputs.length;
                        for(let l = outputsCount-1; l >= 0 ; l--){
                            let dLs = 1;
                            for(let m = middelLevels; m >= 1; m--){
                                if(m == middelLevels)
                                    dLs *= network.levels[j+m].weights[l][i]
                                else
                                    dLs *= network.levels[j+m].weights[l][l];
                                dLs *= (1- Math.tanh(network.levels[j+m].inputs[l])**2)
                            }
                            const dEW = parseFloat(dErr*dLastAct*dLs*level.inputs[k])
                            const dEB = parseFloat(dErr*dLastAct*dLs)
                            if(i == 0){
                                WsUpdate[j][WsUpdate[j].length-1].push(dEW)
                                if(k == inputsCount-1)
                                    BsUpdate[j].push(dEB)
                            }else{
                                WsUpdate[j][inputsCount-1-k][outputsCount-1-l] += dEW
                                if(k == inputsCount-1)
                                    BsUpdate[j][outputsCount-1-l] += dEB
                            }
                        }
                    }
                }
                
                for(let i = levelsCount-1; i >= 0; i--){
                    const level = network.levels[i];
                    const inputsCount = level.inputs.length
                    for(let j = inputsCount-1; j >=0; j--){
                        const outputsCount = level.outputs.length
                        for(let k = outputsCount-1; k >=0; k--){
                            level.weights[j][k] -= 0.1*(WsUpdate[i][inputsCount-1 -j][outputsCount-1 -k]/labelsCount)
                            if(j == inputsCount-1)
                                level.biases[k] -= 0.1*(BsUpdate[i][outputsCount-1 -k]/labelsCount)
                        }
                    }
                }
                
            }
            all++
        });
        let accuracy = correct / all
        if(accuracy >= bestAccuracy){
            updated = true
            bestAccuracy = accuracy
            bestNetwork = network
        }
        printProgress(t, tries)
        console.log(accuracy)
    }
    if(updated)
        fs.writeFileSync(path.join(__dirname, "..", "ml", "NNModel.js"), `module.exports = {
            network:${JSON.stringify(bestNetwork)},
            accuracy:${String(bestAccuracy)}
        }`)
    console.log(bestAccuracy*100 + "%" )
}
/* 
const backwordPropagation = ()=>{
    if(!fs.existsSync(path.join(__dirname, "..", "ml", "NNModel.js")))
        forword()

    const network = require("./NNModel").network;

    for(let i = 0; i < labels.length; i++){
        
    }

    for(let i = 1; i <= tries; i++){
        let correct = 0;
        let all = 0;
        traningSamples.forEach(sample => {
            const pLabel = classify.NN(sample.point, network)
            if(pLabel == sample.label)
                correct++
            all++
        });
        let accuracy = correct / all
        if(accuracy > bestAccuracy){
            updated = true
            bestAccuracy = accuracy
            bestNetwork = network
        }
        printProgress(i, tries)
    }
    if(updated)
        fs.writeFileSync(path.join(__dirname, "..", "ml", "NNModel.js"), `module.exports = {
            network:${JSON.stringify(bestNetwork)},
            accuracy:${String(bestAccuracy)}
        }`)
    console.log(bestAccuracy*100 + "%" )
} */
// createTraningTestingSamples()
// updateTraningTestingSamples()
analyis()
// upgradeNetwork()