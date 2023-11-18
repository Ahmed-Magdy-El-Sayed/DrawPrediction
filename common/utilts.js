const utilts = {}

utilts.printProgress=(count, max)=>{
    process.stdout.clearLine();
    if(count !== max)
        process.stdout.cursorTo(0);
    process.stdout.write(`${count}/${max} (${(count*100/max).toFixed(2)}%)`);
}

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
    return Math.round(
        Math.sqrt(
            (p1[0]*0.8-p2[0])**2
            +(p1[1]*0.8-p2[1])**2
        )
    )
}

utilts.getNearest=(loc, objArray, k=1)=>{
    const obj = objArray.filter(obj=> obj.lable !== "newDraw").map((val, i)=>{ return{i,val:val.points}})
    const sordted = obj.sort((a,b)=>
        utilts.distance(loc,a.val)-utilts.distance(loc, b.val)
    )
    const indices = sordted.map(obj=>obj.i);
    return indices.slice(0,k);
}

utilts.classify = (points, samples, k=1)=>{
    const indices = utilts.getNearest(points, samples, k)// indices of the nearest drawings
    const labels = indices.map(i=>samples[i].label);// labels of the nearest drawings

    let counts = {};// the number of repeating the labels
    for (const label of labels) {
        counts[label] = counts[label]? counts[label]+1 :1
    }
    const Max = Math.max(...Object.values(counts))// the heighest repeated drawing
    // console.log(labels, nearestLabel)

    return labels.find(l=>counts[l]==Max)
}

module.exports = utilts;