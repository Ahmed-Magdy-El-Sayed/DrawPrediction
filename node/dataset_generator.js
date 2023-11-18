const fs = require("fs");
const path = require("path");
const {createCanvas} = require("canvas");
const constants = require("../common/constants");
const draw = require("../common/draw");
const utilts =require("../common/utilts")

// let sample = [];
const canvas = createCanvas(500, 500)// for creating the images
const ctx = canvas.getContext("2d");
const ndjson = require('ndjson');
let labelsOfInseartedObj = [];

function generateImgFile(outFile, paths){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw.paths(ctx, paths);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}

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
    Object.keys(utilts.labelsStyles).slice(0,-1).forEach(label=>{
        parseSimplifiedDrawings(
            label, 
            path.join(__dirname, constants.OUTSOURCE_DIR, label+".ndjson"),
            null,
            (err, obj) => {
            if(err) return console.error(err);
            // fs.appendFileSync(path.join(__dirname, constants.RAW_DIR, label+'.json'), ",")
            labelsOfInseartedObj.includes(label)? 
                fs.appendFileSync(path.join(__dirname, constants.RAW_DIR, label+'.ndjson'), "\n")
            :   labelsOfInseartedObj.push(label)
            const dPaths = [];
            obj.label = obj.word
            delete obj.word
            const X = obj.drawing.flat().map(p=>p[0])
            const Y = obj.drawing.flat().map(p=>p[1])
            const shiftX = Math.min(...X) < 0  ? 1033 : 0;
            const shiftY = Math.min(...Y) < 0  ? 276 : 0;
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
            /* generateImgFile(
                path.join(__dirname,constants.IMG_DIR, obj.key_id+".png"), 
                dPaths
            ) */
            obj.drawing= dPaths 
            fs.appendFileSync(path.join(__dirname, constants.RAW_DIR, label+'.ndjson'), JSON.stringify(obj))
        })
    })
}

//fs.writeFileSync(path.join(__dirname,constants.SAMPLES), JSON.stringify(sample));

const generateImgs = (path)=>{
    const features = JSON.parse(fs.readFileSync(path))
    features.samples.forEach((drawing, i)=>{
        generateImgFile(
            path.join(__dirname,constants.IMG_DIR, drawing.key_id+".png"), 
            JSON.parse(fs.readFileSync(path.join(__dirname, constants.JOSN_DIR, drawing.key_id+".json")))
        )
        utilts.printProgress(i, features.samples.length)
    })
}

const createSamples = ()=>{
    Object.keys(utilts.labelsStyles).slice(0,-1).forEach(label=>{
        parseSimplifiedDrawings(
            label,
            path.join(__dirname, constants.RAW_DIR, label+'.ndjson'),
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
// convertNdToJson()
// createSamples()

