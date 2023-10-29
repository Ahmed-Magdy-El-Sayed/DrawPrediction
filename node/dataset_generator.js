const fs = require("fs");
const path = require("path");
const {createCanvas} = require("canvas");
const constants = require("../common/constants");
const draw = require("../common/draw");
const utilts =require("../common/utilts")

let sample = [];
const canvas = createCanvas(400, 400)
const ctx = canvas.getContext("2d");

// const ndjson = require('ndjson'); // npm install ndjson

/* function parseSimplifiedDrawings(fileName, callback) {
    const drawings = [];
    const fileStream = fs.createReadStream(fileName)
    fileStream
        .pipe(ndjson.parse())
        .on('data', function(obj) {
        drawings.push(obj)
        })
        .on("error", callback)
        .on("end", function() {
        callback(null, drawings)
        });
}

parseSimplifiedDrawings(path.join(__dirname, constants.NDJOSN_DIR, "tree.ndjson"),(err, drawings) => {
    if(err) return console.error(err);
    const modifiedDrawings = []
    drawings.forEach(d => {
        const dPaths = [];
        d.drawing.forEach(stroke=>{
            dPaths.push([])
            stroke.forEach((axis, i)=>{
                if(i == 0)
                    axis.forEach(x=>{
                        dPaths[dPaths.length-1].push([x+100])
                    })
                else
                    axis.forEach((y, i)=>{
                        dPaths[[dPaths.length-1]][i].push(y+100)
                    })
            })
        })
        generateImgFile(
            path.join(__dirname,constants.IMG_DIR, d.key_id+".png"), 
            dPaths
            )
        d.drawing = dPaths
        modifiedDrawings.push(d)
    })
    fs.appendFileSync(path.join(__dirname, constants.JOSN_DIR, 'tree.json'), JSON.stringify(modifiedDrawings))
}) */

//fs.writeFileSync(path.join(__dirname,constants.SAMPLES), JSON.stringify(sample));

function generateImgFile(outFile, paths){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw.paths(ctx, paths);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}
const features = JSON.parse(fs.readFileSync(path.join(__dirname, constants.FEATURES)))
features.samples.forEach((drawing, i)=>{
    generateImgFile(
        path.join(__dirname,constants.IMG_DIR, drawing.key_id+".png"), 
        JSON.parse(fs.readFileSync(path.join(__dirname, constants.JOSN_DIR, drawing.key_id+".json")))
    )
    utilts.printProgress(i, features.samples.length)
})