const NeuralNetwork = require("./neuralNetwork");

const utilts = {}

utilts.printProgress=(count, max)=>{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${count}/${max} (${(count*100/max).toFixed(2)}%)`);
    if(count === max)
        process.stdout.write("\n")
}
utilts.labels = ["airplane", "alarm clock", "apple", "bicycle", "car", "tree"];
// utilts.features = ["Width", "Height", "Elongation", "Roundness", "Complexity"];
utilts.features = new Array(400).fill(" ");

utilts.labelsStyles={
    "airplane":"blue",
    "alarm clock":"deepskyblue",
    "apple":"red",
    "bicycle":"yellow",
    "car":"gray",
    "tree":"green",
    "newDraw": "black"
}

utilts.groupBy=(objArray, key)=>{
    const groups = {};
    for (const obj of objArray) {
        const val = obj[key].toString();
        if(!groups[val])
            groups[val] = [];
        groups[val].push(obj)
    }
    return groups;
}

utilts.generateImgFile = (outFile, paths)=>{
    const {createCanvas} = require("canvas");
    const canvas = createCanvas(500, 500)
    const ctx = canvas.getContext("2d");
    const draw = require("../common/draw");
    const fs = require("fs")

    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw.paths(ctx, paths);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}

utilts.repetitionNum= (samples, indexs)=>{
    const repetitionNum = {};
    for (const i in indexs) {
        const label = samples[indexs[i]].lable;
        if(!repetitionNum[label]){
            repetitionNum[label] = [];
        }
        repetitionNum[label].push("found")
    }
    for (const key in repetitionNum) {
        repetitionNum[key] = repetitionNum[key].length
    }
    return repetitionNum
}

utilts.distance=(p1, p2)=>{
    let sqDist = 0;
    p1.forEach((axis, i)=>{
        sqDist += (p1[i] - p2[i])**2
    })
    return Math.sqrt( sqDist )
}

utilts.getNearest=(loc, objArray, k=1)=>{
    const obj = objArray.filter(obj=> obj.lable !== "newDraw").map((val, i)=>{ return{i,val:val.points}})
    const sordted = obj.sort((a,b)=>
        utilts.distance(loc,a.val)-utilts.distance(loc, b.val)
    )
    const indices = sordted.map(obj=>obj.i);
    return indices.slice(0,k);
}
let network;
utilts.classify = {
    KNN: (point, samples, k=1)=>{
        const indices = utilts.getNearest(point, samples, k)// indices of the nearest drawings
        const labels = indices.map(i=>samples[i].label);// labels of the nearest drawings

        let counts = {};// the number of repeating the labels
        for (const label of labels) {
            counts[label] = counts[label]? counts[label]+1 :1
        }
        const max = Math.max(...Object.values(counts))// the heighest repeated drawing
        // console.log(labels, nearestLabel)

        return labels.find(l=>counts[l] = max)
    },
    NN: (point, setNetwork = null) =>{
        if(!network && !setNetwork){
            network = require("../ml/NNModel").network
        }
        const outputs = NeuralNetwork.feedForword(point, network? network:setNetwork)
        const i = outputs.indexOf( Math.max(...outputs) );
        // console.log(outputs)
        return utilts.labels[i]
    }
}

module.exports = utilts;