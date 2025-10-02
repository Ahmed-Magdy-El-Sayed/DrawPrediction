const { labels, KNNFeatures, ANNFeatures, printProgress } = require("../common/utilts");
const NeuralNetwork = require("./neuralNetwork");


let network = require("../ml/NNModel").network;
const classify =  (point, networkParam = null) =>{
    const outputs = NeuralNetwork.feedForword(point, networkParam? networkParam:network)
    const i = outputs.indexOf( Math.max(...outputs) );
    
    return labels[i]
}

const constants = require("../common/constants");
const fs = require("fs");
const path = require("path");
const traningSamples = /* require("../data/dataset/traningSamples").samples */ {};
const testingSamples = /* require("../data/dataset/testingSamples").samples */ {};
const analysisObj = require("../controller/analysisResult");
const testingResult = {correct: 0, wrong: 0, all: testingSamples.length}

const analyis= async ()=>{
    // testing the model
    console.log("testing model...")
    testingSamples.forEach(sample => {
        const pLabel = classify(sample.ANNPoint)
        if(pLabel == sample.label)
            testingResult.correct++
        else
            testingResult.wrong++ 
        
        sample.predicted = pLabel
    });
    console.log(testingResult.correct + "/" + testingResult.all, testingResult.correct*100 / testingResult.all + "%" )
    
    analysisObj.testingResultANN =  testingResult
    // add predicted labels
    fs.writeFileSync(path.join(__dirname, constants.TESTING_SAMPLES), `module.exports = {"KNNFeaturesName": ${JSON.stringify(KNNFeatures)}, "ANNFeaturesName": ${JSON.stringify(ANNFeatures)}, "samples": `)
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), JSON.stringify(testingSamples))
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), '}')

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

const traningNetwork = (tries = 5)=>{
    let network
    const labelsCount = labels.length;
    if(fs.existsSync(path.join(__dirname, "..", "ml", "NNModel.js"))){
        const model = require("./NNModel");
        network = model.network;
    }else
        network = new NeuralNetwork([ANNFeatures.length, 100, 100, labelsCount]);
    
    const levelsCount = network.levels.length
    let accuracy 
    for(let t = 1; t <= tries; t++){
        let correct = 0;
        let all = 0;
        let SCount = 0;
        for(let SType = 0; SCount < 1000; SType++){
            const sample = traningSamples[SType*1000+SCount];
            const pLabel = classify(sample.ANNPoint, network) // forword propagation
            if(pLabel == sample.label)
                correct++
            // backword propagation
            // calc lose in weights & biases
            const WsUpdate = {};
            const BsUpdate = {};
            const LastOutputs = network.levels.slice(-1)[0].outputs
            
            for(let i = 0; i < labelsCount; i++){
                const LastOutputI = labels.indexOf(sample.label)
                const dErr_dAct = LastOutputs[i] - (LastOutputI == i? 1 : 0)
                // console.log(dErr_dAct)
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
                                dLs *= (1- Math.tanh(network.levels[j+m].inputs[l])**2) // tanh derivative
                            }
                            
                            const dEW = parseFloat(dErr_dAct*dLs*level.inputs[k])
                            const dEB = parseFloat(dErr_dAct*dLs)
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
            }
            // update weights & biases
            for(let i = levelsCount-1; i >= 0; i--){
                const level = network.levels[i];
                const inputsCount = level.inputs.length
                for(let j = inputsCount-1; j >=0; j--){
                    const outputsCount = level.outputs.length
                    for(let k = outputsCount-1; k >=0; k--){
                        level.weights[j][k] -= parseFloat(0.001*(WsUpdate[i][inputsCount-1 -j][outputsCount-1 -k]/labelsCount))
                        if(j == inputsCount-1)
                            level.biases[k] -= parseFloat(0.001*(BsUpdate[i][outputsCount-1 -k]/labelsCount))
                    }
                }
            }
            all++
            if(SType == 5){
                SType = -1
                SCount++
            }
        };
        accuracy = correct / all*100 + "%"
        printProgress(t, tries)
        console.log(accuracy)
    }
        fs.writeFileSync(path.join(__dirname, "..", "ml", "NNModel.js"), `module.exports = {
            network:${JSON.stringify(network)},
            accuracy:"${accuracy}"
        }`)
    analyis()
}

module.exports = classify