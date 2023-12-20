const utilts = require("./utilts")

const featuresCollector = {}

featuresCollector.getPathsCount=(paths)=>{
    return paths.length;
}

featuresCollector.getPointsCount=(paths)=>{
    return paths.flat().length;
}

featuresCollector.getWidthAxis=(paths)=>{// depend on the x-axis dectance between the smallest and largest x-axis value
    const points = paths.flat();
    const x = points.map(p=>p[0]).length === 0? [0] : points.map(p=>p[0]);
    return Math.max(...x) - Math.min(...x)
}
featuresCollector.getHeightAxis=(paths)=>{// depend on the y-axis dectance between the smallest and largest y-axis value
    const points = paths.flat();
    const y = points.map(p=>p[1]).length === 0? [0] : points.map(p=>p[1])
    return Math.max(...y) - Math.min(...y)
}

featuresCollector.getWidthPoints=(paths)=>{// depend on the dectance between the points it's self
    const points = paths.flat();
    const x = points.map(p=>p[0]).length === 0? [0] : points.map(p=>p[0]);
    const p1 = points.filter(p=> p[0] === Math.max(...x))[0]
    const p2 = points.filter(p=> p[0] === Math.min(...x))[0]
    return utilts.distance(p1, p2)
}
featuresCollector.getHeightPoints=(paths)=>{// depend on the dectance between the points it's self
    const points = paths.flat();
    const y = points.map(p=>p[1]).length === 0? [0] : points.map(p=>p[1]);
    const p1 = points.filter(p=> p[1] === Math.max(...y))[0]
    const p2 = points.filter(p=> p[1] === Math.min(...y))[0]
    return utilts.distance(p1, p2)
}
const geometry = require("./geometry");
const { createCanvas } = require("canvas");
const draw = require("./draw");

featuresCollector.getWidthHeight = (paths)=>{
    const {width, height} = geometry.getMinBoundingBox(paths)
    return [width, height]
}

featuresCollector.getElongation = (paths)=>{
    const {width, height} = geometry.getMinBoundingBox(paths)
    return parseFloat(
        (
            (Math.max(width, height) +1) 
            / (Math.min(width, height) +1)
        ).toFixed(2)
    )
}

featuresCollector.getRoundness = paths=>{
    const hull = geometry.grahamScan(paths.flat())
    const length = geometry.getLength(hull);
    const polygonArea = geometry.getArea(hull);
    const r = length / (2 * Math.PI);
    const circleArea = Math.PI * r**2;
    const roundness = polygonArea / circleArea
    return isNaN(roundness)? 0 : parseFloat(roundness.toFixed(2))
}

featuresCollector.getPixels = (paths, size = 500, expand = true) =>{
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    if(expand){
        const maxX = Math.max(...paths.flat().map(p=>p[0]))
        const minX = Math.min(...paths.flat().map(p=>p[0]))
        const maxY = Math.max(...paths.flat().map(p=>p[1]))
        const minY = Math.min(...paths.flat().map(p=>p[1]))

        const newPaths = paths.map(stroke=>
            stroke.map(point=>[
                (point[0]-minX)/(maxX-minX) * size,
                (point[1]-minY)/(maxY-minY) * size
            ])
        )
        
        draw.paths(ctx, newPaths)
    }else
        draw.paths(ctx, paths)

    return ctx.getImageData(0, 0, size, size).data.filter((p, i)=>i % 4 === 3)
}

featuresCollector.getComplexity = pixels=>{
    return pixels.filter(a=> a!=0).length
}

module.exports = featuresCollector;