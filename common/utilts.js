const utilts = {}

utilts.printProgress=(count, max)=>{
    process.stdout.clearLine();
    if(count !== max)
        process.stdout.cursorTo(0);
    process.stdout.write(`${count}/${max} (${(count*100/max).toFixed(2)}%)`);
}

utilts.styles={
    "airplane":"blue",
    "alarm clock":"black",
    "apple":"red",
    "bicycle":"yellow",
    "car":"gray",
    "tree":"green",
    "test": "#FF5722"
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
            (p1[0]-p2[0])**2
            +(p1[1]-p2[1])**2
        )
    )
}

utilts.getNearest=(loc, objArray, k=1)=>{
    const obj = objArray.filter(obj=> obj.lable !== "test").map((val, i)=>{ return{i,val:val.points}})
    const sordted = obj.sort((a,b)=>
        utilts.distance(loc,a.val)-utilts.distance(loc, b.val)
    )
    const indices = sordted.map(obj=>obj.i);
    return indices.slice(0,k);
}

if(typeof module !== "undefined"){
    module.exports = utilts;
}