const constants = require("../common/constants");
const fs = require("fs");
const path = require("path");

const { labels, KNNFeatures, ANNFeatures, printProgress} = require("../common/utilts");

const createTraningTestingSamples = ()=>{// separate the samples to training sample and testing sample
    fs.writeFileSync(path.join(__dirname,constants.TRANING_SAMPLES), `module.exports = {"KNNFeaturesName": ${JSON.stringify(KNNFeatures)}, "ANNFeaturesName": ${JSON.stringify(ANNFeatures)}, "samples": [`);
    fs.writeFileSync(path.join(__dirname,constants.TESTING_SAMPLES), `module.exports = {"KNNFeaturesName": ${JSON.stringify(KNNFeatures)}, "ANNFeaturesName": ${JSON.stringify(ANNFeatures)}, "samples": [`);

    labels.forEach(label=>{
        //create traning and testing samples by separating each sample between traning and testing
        const samples = JSON.parse(fs.readFileSync(path.join(__dirname, constants.SAMPLES_DIR, label+"-samples.json")));
        const lastLabel = labels[labels.length-1];
        console.log("adding and separetaing "+label+"...")
        samples.forEach((sample, i)=> {
            //add to traning and testing files
            if(i < (samples.length-1)/2 || (i == (samples.length-1)/2 && label != lastLabel)){
                fs.appendFileSync(path.join(__dirname,constants.TESTING_SAMPLES),JSON.stringify(sample)+",")
            }else if(i == (samples.length-1)/2){
                fs.appendFileSync(path.join(__dirname,constants.TESTING_SAMPLES),JSON.stringify(sample)+"]")
            }else{
                if(i < samples.length-1 || (i == samples.length-1 && label != lastLabel))
                    fs.appendFileSync(path.join(__dirname,constants.TRANING_SAMPLES),JSON.stringify(sample)+",")
                else
                    fs.appendFileSync(path.join(__dirname,constants.TRANING_SAMPLES),JSON.stringify(sample)+"]")
            }
        })
        console.log("adding "+label+" done!")
    })
    fs.appendFileSync(path.join(__dirname, constants.TRANING_SAMPLES), "}")
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), "}")
    console.log("traning & testing samples collecting done!")
}

const traningSamples = require("../data/dataset/traningSamples").samples;
const testingSamples = require("../data/dataset/testingSamples").samples;
const featuresCollector = require("./featuresCollector");

const extractSamplesFeatures = ()=>{ 
    console.log("updating traning samples...")
    traningSamples.forEach((sample, i)=>{
        const paths = JSON.parse(fs.readFileSync(path.join(__dirname,constants.JOSN_DIR, sample.key_id+".json")));

        // sample.ANNPoint = Object.values(featuresCollector.getPixels(paths, 20))

        sample.KNNPoint = [
            featuresCollector.getPathsCount(paths), 
            featuresCollector.getPointsCount(paths),
            featuresCollector.getElongation(paths),
            featuresCollector.getRoundness(paths),
            featuresCollector.getComplexity(paths)
        ]
        
        printProgress(i+1, traningSamples.length)
    })
    fs.writeFileSync(path.join(__dirname, constants.TRANING_SAMPLES), `module.exports = {"KNNFeaturesName": ${JSON.stringify(KNNFeatures)}, "ANNFeaturesName": ${JSON.stringify(ANNFeatures)}, "samples": `)
    fs.appendFileSync(path.join(__dirname, constants.TRANING_SAMPLES), JSON.stringify(traningSamples))
    fs.appendFileSync(path.join(__dirname, constants.TRANING_SAMPLES), '}')

    console.log("updating testing samples...")
    testingSamples.forEach((sample, i)=>{
        const paths = JSON.parse(fs.readFileSync(path.join(__dirname,constants.JOSN_DIR, sample.key_id+".json")));

        // sample.ANNPoint = Object.values(featuresCollector.getPixels(paths, 20))


        sample.KNNPoint = [
            featuresCollector.getPathsCount(paths), 
            featuresCollector.getPointsCount(paths),
            featuresCollector.getElongation(paths),
            featuresCollector.getRoundness(paths),
            featuresCollector.getComplexity(paths)
        ]
        printProgress(i+1, testingSamples.length)
    })
    fs.writeFileSync(path.join(__dirname, constants.TESTING_SAMPLES), `module.exports = {"KNNFeaturesName": ${JSON.stringify(KNNFeatures)}, "ANNFeaturesName": ${JSON.stringify(ANNFeatures)}, "samples": `)
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), JSON.stringify(testingSamples))
    fs.appendFileSync(path.join(__dirname, constants.TESTING_SAMPLES), '}')
    console.log("updating done!")
}

// createTraningTestingSamples()
// extractSamplesFeatures()

const createLiteKNNSamples = ()=>{
    //create the lite samples for KNN suggestion by
    //take 30 sample from each label from testing samples
    fs.writeFileSync(path.join(__dirname, constants.KNN_SAMPLES), `module.exports = {"KNNFeaturesName": ${JSON.stringify(KNNFeatures)}, "samples": {`);

    console.log("start create Lite KNNSamples!")
    const labelsCount={};
    testingSamples.forEach((sample)=> {
        if(labelsCount[sample.label] > 30 || (sample.label !== sample.predicted)) return;

        labelsCount[sample.label] = (labelsCount[sample.label] || 0) + 1;
        // create a lite sample
        sample = {key_id: sample.key_id, label: sample.label, KNNPoint: sample.KNNPoint};
        
        if(labelsCount[sample.label] === 1){
            fs.appendFileSync(path.join(__dirname, constants.KNN_SAMPLES),`"${sample.label}": [${JSON.stringify(sample)}, `);
            console.log("collecting samples for "+sample.label+"...")
        }else if(labelsCount[sample.label] === 31){ 
            fs.appendFileSync(path.join(__dirname, constants.KNN_SAMPLES),JSON.stringify(sample)+"]"+(Object.keys(labelsCount).length === labels.length ? "" : ", "));
            console.log("collecting 30 samples for "+sample.label+" - done!")
        }else
            fs.appendFileSync(path.join(__dirname, constants.KNN_SAMPLES),JSON.stringify(sample)+", ")
        /* 
        fs.copyFile(path.join(__dirname, constants.IMG_DIR, sample.key_id+".png"), 
            path.join(__dirname, constants.KNN_IMAGES_DIR, sample.key_id+".png"),
            err=>{
                if(err) console.log(err);
            }
        )
        fs.copyFile(path.join(__dirname, constants.JOSN_DIR, sample.key_id+".json"), 
            path.join(__dirname, constants.KNN_JSON_DIR, sample.key_id+".json"),
            err=>{
                if(err) console.log(err);
            }
        ) */
    })
    fs.appendFileSync(path.join(__dirname, constants.KNN_SAMPLES),"}}");
    console.log("adding samples - done!")
}
createLiteKNNSamples();
/* {"countrycode":"CA",
    "timestamp":"2017-03-28 00:09:21.21107 UTC",
    "recognized":true,
    "key_id":"4704293372297216",
    "label":"alarm clock",
    "predicted":"alarm clock",
    "ANNPoint":[0,83,196,254,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,80,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,169,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,143,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,199,90,254,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,233,255,255,255,255,255,255,255,245,174,167,153,153,153,220,255,255,255,255,255,255,255,255,255,255,255,247,170,12,0,0,0,0,0,6,145,255,255,255,255,255,255,255,255,209,97,8,0,0,0,0,0,0,0,0,0,148,255,255,255,255,255,255,247,25,0,0,0,0,0,0,0,0,0,0,0,13,247,255,255,255,255,255,150,0,0,0,0,0,0,0,0,0,0,0,0,0,191,255,255,255,255,244,31,0,0,0,0,0,0,0,0,0,0,0,0,0,145,255,255,255,255,151,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,255,255,255,255,128,0,0,0,0,0,0,0,0,0,0,0,0,0,39,247,255,255,255,255,128,0,0,0,0,0,0,0,0,0,0,0,0,0,181,255,255,255,255,255,194,0,0,0,0,0,0,0,0,0,0,0,0,88,255,255,255,255,255,255,255,173,16,0,0,0,0,0,0,0,0,0,50,236,255,255,255,255,255,255,255,255,215,105,15,0,2,47,81,89,123,192,253,255,255,255,255,255,255,255,255,255,255,255,237,144,224,255,255,255,255,255,255,255,255,255,255,181,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,219,21,85,242,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,207,31,0],
    "KNNPoint":[6,124,1.05,0.95,6]
} */