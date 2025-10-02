const utilts = {}

utilts.printProgress=(count, max)=>{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${count}/${max} (${(count*100/max).toFixed(2)}%)`);
    if(count === max)
        process.stdout.write("\n")
}
utilts.labels = ["airplane", "alarm clock", "apple", "bicycle", "car", "tree"];

utilts.KNNFeatures = ["PathsNum", "PointsNum", "Elongation", "Roundness", "Complexity"];
utilts.ANNFeatures = new Array(400).fill(" ");


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

utilts.distance=(p1, p2)=>{
    let sqDist = 0;
    p1.forEach((axis, i)=>{
        if(i>1 && i<4)
            sqDist += (p1[i] - p2[i])**2
    })
    return Math.sqrt( sqDist )
}

module.exports = utilts;