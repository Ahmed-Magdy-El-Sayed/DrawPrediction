const constants = require("../common/constants");
const featuresCollector = require("../common/featuresCollector");
const fs = require("fs");
const path = require("path");
const { styles } = require("../common/utilts");

const createSamples = ()=>{
    ["airplane", "alarm clock", "apple", "bicycle", "car", "tree"].forEach(label=>{
        fs.writeFileSync(path.join(__dirname,constants.SAMPLES_DIR, label+"-samples.json"),"[");
        const samplesPart = JSON.parse(fs.readFileSync(path.join(__dirname, constants.RAW_DIR, label+".json")))
        samplesPart.forEach((sample, i)=>{
            // samples.push(sample);
            fs.writeFileSync(path.join(__dirname,constants.JOSN_DIR, sample.key_id+".json"), JSON.stringify(sample.drawing));
            delete sample.drawing
            if(i == samplesPart.length-1)
                fs.appendFileSync(path.join(__dirname,constants.SAMPLES_DIR, label+"-samples.json"),JSON.stringify(sample)+"]")
            else
                fs.appendFileSync(path.join(__dirname,constants.SAMPLES_DIR, label+"-samples.json"),JSON.stringify(sample)+",")
        })
        console.log(label+" collecting done!")
    })
    console.log("samples collecting done!")
}

const collectFeatures = ()=>{
    fs.writeFileSync(path.join(__dirname, constants.FEATURES), '{"featuresName": ["Width", "Height"], "samples": [');
    Object.keys(styles).forEach(label=>{
        if(label == "test") return null
        for (const label in styles) {//create features.json by seperate coordenates to seperated files in json folder and collect the objects with the rest attributes in feature.json file
            const samples = JSON.parse(fs.readFileSync(path.join(__dirname, constants.SAMPLES_DIR, label+"-samples.json")));
            console.log(label+" collecting...")
            samples.forEach((sample, i)=> {
                const paths = JSON.parse(fs.readFileSync(path.join(__dirname, constants.JOSN_DIR, sample.key_id+".json")));
                sample.points=[
                    featuresCollector.getNewWidth(paths),
                    featuresCollector.getNewHeight(paths)
                ]
                if(label != "tree")
                    fs.appendFileSync(path.join(__dirname, constants.FEATURES),JSON.stringify(sample)+",")
                else{
                    if(i != samples.length-1)
                        fs.appendFileSync(path.join(__dirname, constants.FEATURES),JSON.stringify(sample)+",")
                    else
                        fs.appendFileSync(path.join(__dirname, constants.FEATURES),JSON.stringify(sample)+"]")
                }
            })
            console.log(label+"collecting done!")
        }
    })
    fs.appendFileSync(path.join(__dirname, constants.FEATURES), "}")
    console.log("features collecting done!")
}

const featuresJsonToJs = ()=>{
    fs.writeFileSync(path.join(__dirname,constants.DATASET_DIR, "features.js"), "const features= ");
    fs.appendFileSync(path.join(__dirname,constants.DATASET_DIR, "features.js"), 
        fs.readFileSync(path.join(__dirname,constants.DATASET_DIR, "features.json"))
    );
}

const createTraningAndTestingSets = ()=>{
    fs.writeFileSync(path.join(__dirname,constants.DATASET_DIR, "traningSet.js"), "const traningSet= {");
    fs.writeFileSync(path.join(__dirname,constants.DATASET_DIR, "testingSet.js"), "const testingSet= {");
    
    Object.keys(styles).forEach(label=>{
        if(label == "test") return null
        fs.appendFileSync(path.join(__dirname,constants.DATASET_DIR, "traningSet.js"), `"${label}":[`);
        fs.appendFileSync(path.join(__dirname,constants.DATASET_DIR, "testingSet.js"), `"${label}":[`);
        const samplesPart = JSON.parse(fs.readFileSync(path.join(__dirname, constants.SAMPLES_DIR, label+"-samples.json")))
        samplesPart.forEach((sample, i)=>{
            if(i < Math.floor((samplesPart.length-1)/2))
                fs.appendFileSync(path.join(__dirname,constants.DATASET_DIR, "traningSet.js"),JSON.stringify(sample)+",")
            else if( i == Math.floor((samplesPart.length-1)/2)){
                if(label != "tree")
                    fs.appendFileSync(path.join(__dirname,constants.DATASET_DIR, "traningSet.js"),JSON.stringify(sample)+"],")
                else
                    fs.appendFileSync(path.join(__dirname,constants.DATASET_DIR, "traningSet.js"),JSON.stringify(sample)+"]}")
            }else{
                if(i != samplesPart.length-1)
                    fs.appendFileSync(path.join(__dirname,constants.DATASET_DIR, "testingSet.js"),JSON.stringify(sample)+",")
                else{
                    if(label != "tree")
                        fs.appendFileSync(path.join(__dirname,constants.DATASET_DIR, "testingSet.js"),JSON.stringify(sample)+"],")
                    else
                        fs.appendFileSync(path.join(__dirname,constants.DATASET_DIR, "testingSet.js"),JSON.stringify(sample)+"]}")
                }
            }
        })
    })
}
