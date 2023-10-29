const featuresCollector = {}

featuresCollector.getPathsCount=(paths)=>{
    return paths.length;
}

featuresCollector.getPointsCount=(paths)=>{
    return paths.flat().length;
}

featuresCollector.getWidth=(paths)=>{
    const points = paths.flat();
    const x = points.map(p=>p[0]).length === 0? [0] : points.map(p=>p[0]);
    return Math.max(...x) - Math.min(...x)
}
featuresCollector.getHeight=(paths)=>{
    const points = paths.flat();
    const y = points.map(p=>p[1]).length === 0? [0] : points.map(p=>p[1])
    return Math.max(...y) - Math.min(...y)
}

featuresCollector.getNewWidth=(paths)=>{
    const points = paths.flat();
    const x = points.map(p=>p[0]).length === 0? [0] : points.map(p=>p[0]);
    const p1 = points.filter(p=> p[0] === Math.max(...x))[0]
    const p2 = points.filter(p=> p[0] === Math.min(...x))[0]
    return utilts.distance(p1, p2)
}
featuresCollector.getNewHeight=(paths)=>{
    const points = paths.flat();
    const y = points.map(p=>p[1]).length === 0? [0] : points.map(p=>p[1]);
    const p1 = points.filter(p=> p[1] === Math.max(...y))[0]
    const p2 = points.filter(p=> p[1] === Math.min(...y))[0]
    return utilts.distance(p1, p2)
}

if(typeof module !== "undefined")
    module.exports = featuresCollector;