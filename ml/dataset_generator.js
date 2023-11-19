const fs = require("fs");
const path = require("path");
const constants = require("../common/constants");
const utilts =require("../common/utilts")
const ndjson = require('ndjson');
let labelsOfInseartedObj = [];

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
const convertPaths = ()=>{
    utilts.labels.forEach(label=>{
        parseSimplifiedDrawings(
            label, 
            path.join(__dirname, constants.ROW_OUTSOURCE_DIR, label+".ndjson"),
            null,
            (err, obj) => {
            if(err) return console.error(err);
            // fs.appendFileSync(path.join(__dirname, constants.RAW_DIR, label+'.json'), ",")
            labelsOfInseartedObj.includes(label)? 
                fs.appendFileSync(path.join(__dirname, constants.TRANS_OUTSOURCE_DIR, label+'.ndjson'), "\n")
            :   labelsOfInseartedObj.push(label)
            const dPaths = [];
            obj.label = obj.word
            delete obj.word
            const X = obj.drawing.flat().map(p=>p[0])
            const Y = obj.drawing.flat().map(p=>p[1])
            const minX = Math.min(...X);
            const minY = Math.min(...Y);
            const shiftX = minX < 0  ? -minX : 0;
            const shiftY = minY < 0  ? -minY : 0;
            obj.drawing.forEach(stroke=>{
                dPaths.push([])
                stroke.forEach((axis, i)=>{
                    if(i == 0)
                        axis.forEach(x=>{
                            dPaths[dPaths.length-1].push([parseFloat((x+shiftX).toFixed(3))])
                        })
                    if(i == 1)
                        axis.forEach((y, i)=>{
                            dPaths[[dPaths.length-1]][i].push(parseFloat((y+shiftY).toFixed(3)))
                        })
                })
            })
            utilts.generateImgFile(
                path.join(__dirname,constants.IMG_DIR, obj.key_id+".png"), 
                dPaths
            )
            obj.drawing= dPaths 
            fs.appendFileSync(path.join(__dirname, constants.TRANS_OUTSOURCE_DIR, label+'.ndjson'), JSON.stringify(obj))
        })
    })
}

//fs.writeFileSync(path.join(__dirname,constants.SAMPLES), JSON.stringify(sample));

const createSamples = ()=>{
    utilts.labels.forEach(label=>{
        parseSimplifiedDrawings(
            label,
            path.join(__dirname, constants.TRANS_OUTSOURCE_DIR, label+'.ndjson'),
            path.join(__dirname,constants.SAMPLES_DIR, label+"-samples.json"),
            (err, obj)=>{
                if(err) return console.error(err);

                labelsOfInseartedObj.includes(label)? 
                    fs.appendFileSync(path.join(__dirname,constants.SAMPLES_DIR, label+"-samples.json"), ",")
                :   labelsOfInseartedObj.push(label)

                fs.writeFileSync(path.join(__dirname,constants.JOSN_DIR, obj.key_id+".json"), JSON.stringify(obj.drawing));
                delete obj.drawing
                fs.appendFileSync(path.join(__dirname,constants.SAMPLES_DIR, label+"-samples.json"),JSON.stringify(obj))
            }
        )
    })
}
// convertPaths()
createSamples()

