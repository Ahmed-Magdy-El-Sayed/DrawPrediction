const fs = require("fs");
const path = require("path");
const constants = require("../common/constants");
const utilts =require("../common/utilts")
const ndjson = require('ndjson');
const featuresCollector = require("../common/featuresCollector")

function parseSimplifiedDrawings(label, sourcePath, destPath, callback) {
    console.log("converting "+label+"...")
    if(destPath) fs.writeFileSync(destPath, "[")
    const fileStream = fs.createReadStream(sourcePath)
    fileStream
        .pipe(ndjson.parse())
        .on('data', function(obj) {
            callback(null, obj)
        })
        .on("error", callback)
        .on("end", function() {
            if(destPath) fs.appendFileSync(destPath, "]")
            console.log("converting "+label+" done!")
        });
}
const addedObjs = {};
utilts.labels.forEach(label=>{
    addedObjs[label] = 0;
})
const convertPaths = ()=>{
    utilts.labels.forEach(label=>{
        fs.writeFileSync(path.join(__dirname,constants.TRANS_OUTSOURCE_DIR, label+".ndjson"), "")
        parseSimplifiedDrawings(
            label, 
            path.join(__dirname, constants.ROW_OUTSOURCE_DIR, label+".ndjson"),
            null,
            (err, obj) => {
                if(err) return console.error(err);

                if(addedObjs[label] > 2000) return null
                else if(addedObjs[label] == 2000){
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    process.stdout.write(JSON.stringify(addedObjs));
                    return null
                }
                
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(JSON.stringify(addedObjs));

                const dPaths = [];
                obj.label = obj.word
                delete obj.word
                const X = [];
                obj.drawing.flat().forEach((axis, i)=>{if(i % 3 === 0) X.push(...axis)})
                const Y = []; 
                obj.drawing.flat().forEach((axis, i)=>{if(i % 3 === 1) Y.push(...axis)})
                const minX = Math.min(...X);
                const minY = Math.min(...Y);
                const maxX = Math.max(...X);
                const maxY = Math.max(...Y);
                const shiftX = minX < 0 || maxX > 500 ? -minX : 0;
                const shiftY = minY < 0 || maxY > 500 ? -minY : 0;
                obj.drawing.forEach(stroke=>{// re-structure the stroke from [[x,x,x,...],[y,y,y,...],[t,t,t,...]] to [[x,y],[x,y],[x,y],...] 
                    dPaths.push([])
                    stroke.forEach((axis, i)=>{
                        if(i == 0)
                            axis.forEach(x=>{
                                dPaths[dPaths.length-1].push([parseFloat((x+shiftX).toFixed(3))])
                            })
                        if(i == 1)
                            axis.forEach((y, i)=>{
                                dPaths[dPaths.length-1][i].push(parseFloat((y+shiftY).toFixed(3)))
                            })
                    })
                })
                obj.drawing= dPaths 
                
                const dimension =[
                    parseFloat(getWidth(dPaths).toFixed(3)),
                    parseFloat(getHeight(dPaths).toFixed(3))
                ]
                if (Math.max(...dimension) > 500)
                    return null;
                addedObjs[label]++
                // fs.appendFileSync(path.join(__dirname, constants.RAW_DIR, label+'.json'), ",")
                if (addedObjs[label])
                    fs.appendFileSync(path.join(__dirname, constants.TRANS_OUTSOURCE_DIR, label+'.ndjson'), "\n")

                fs.appendFileSync(path.join(__dirname, constants.TRANS_OUTSOURCE_DIR, label+'.ndjson'), JSON.stringify(obj))
            }
        )
    })
}

//fs.writeFileSync(path.join(__dirname,constants.SAMPLES), JSON.stringify(sample));
let labelsOfInseartedObj = [];
const createSamples = ()=>{
    utilts.labels.forEach(label=>{
        parseSimplifiedDrawings(
            label,
            path.join(__dirname, constants.TRANS_OUTSOURCE_DIR, label+'.ndjson'),
            path.join(__dirname,constants.SAMPLES_DIR, label+"-samples.json"),
            (err, obj)=>{
                if(err) return console.error(err);
                // calc the width and height
                obj.KNNPoint=[
                    parseFloat(featuresCollector.getWidthAxis(obj.drawing).toFixed(3)),
                    parseFloat(featuresCollector.getHeightAxis(obj.drawing).toFixed(3)),
                    featuresCollector.getElongation(obj.drawing),
                    featuresCollector.getRoundness(obj.drawing),
                    featuresCollector.getComplexity(obj.drawing)
                ]
                obj.ANNPoint= Object.values(featuresCollector.getPixels(obj.drawing, 20))
                //add new line if there is an obj in the file
                labelsOfInseartedObj.includes(label)? 
                    fs.appendFileSync(path.join(__dirname,constants.SAMPLES_DIR, label+"-samples.json"), ",")
                :   labelsOfInseartedObj.push(label)
                //add the paths in a seperated file
                fs.writeFileSync(path.join(__dirname,constants.JOSN_DIR, obj.key_id+".json"), JSON.stringify(obj.drawing));
                // generate the draw image
                utilts.generateImgFile(
                    path.join(__dirname, constants.IMG_DIR, obj.key_id+".png"), 
                    obj.drawing
                )
                // add the obj without the paths
                delete obj.drawing
                fs.appendFileSync(path.join(__dirname,constants.SAMPLES_DIR, label+"-samples.json"),JSON.stringify(obj))
            }
        )
    })
}
/* ------------------- run each one of these two functions seperatly as the functions are async ------------------- */
convertPaths() // run this frist
// createSamples() // comment the appove line and run this

