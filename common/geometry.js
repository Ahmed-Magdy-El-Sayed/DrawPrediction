const { distance } = require("./utilts")

const geometry ={}

geometry.getLowest = points=>
    points.reduce((lowest, point)=>{
        if(point[1] < lowest[1])
            return point
        else if(point[1] === lowest[1] && point[0] < lowest[0])
            return point
        return lowest
    })
geometry.getOrientation = (p1, p2, p3)=>{// 0 ==> 3 point in same line, 1 ==> clockwise, -1 ==> counter-clockwise
    const val = (p2[1]-p1[1])*(p3[0]-p2[0]) - (p3[1]-p2[1])*(p2[0]-p1[0]);

    return val === 0? 0 : val > 0? 1 : -1;
}
geometry.sortPoints = (origin, points)=>
    points.sort((a, b)=>{// order by the polar angle
        const orientation = geometry.getOrientation(origin, a, b);
        if(orientation === 0)
            return distance(origin, a) - distance(origin, b)
        return orientation
    });

geometry.grahamScan = points=>{
    const lowestPoint = geometry.getLowest(points);
    const sortedPoints = geometry.sortPoints(lowestPoint, points);
    const stack = [sortedPoints[0], sortedPoints[1], sortedPoints[2]];

    for(let i=3; i < sortedPoints.length; i++){
        let top = stack.length-1
        while(top > 0 && geometry.getOrientation(stack[top-1], stack[top], sortedPoints[i]) >= 0){
            stack.pop()
            top--
        }
        stack.push(sortedPoints[i])
    }
    if(stack[0].x == stack[1].x && stack[0].y == stack[1].y)
        stack.shift()
    
    return stack
}

geometry.getCoincidentBox = (hull, i, j)=>{
    const diff = (p1, p2)=> [p1[0]-p2[0], p1[1]-p2[1]];
    const unit = v=>{
        const m = Math.sqrt(v[0]**2 + v[1]**2)
        return [v[0]/m, v[1]/m] 
    }
    const dot = (p1, p2)=> p1[0]*p2[0] + p1[1]*p2[1]
    const mult = (v, m)=> [v[0]*m, v[1]*m]
    const add = (p1, p2)=> [p1[0]+p2[0], p1[1]+p2[1]]

    const origin = hull[i];
    const baseX = unit(diff(hull[j], origin))
    const baseY = [-baseX[1], baseX[0]]

    let left = 0;
    let right = 0;
    let top = 0;
    let bottom = 0;

    hull.forEach(point=>{
        const or = diff(origin, point)
        const v = [dot(baseX, or), dot(baseY, or)]

        if(v[0] < left)
            left = v[0]
        if(v[0] > right)
            right = v[0]
        if(v[1] > top)
            top = v[1] 
        if(v[1] < bottom)
            bottom = v[1]
    })
    /* const vertices = [
        add(add(mult(baseX, right), mult(baseY, top)), origin),
        add(add(mult(baseX, left), mult(baseY, top)), origin),
        add(add(mult(baseX, left), mult(baseY, bottom)), origin),
        add(add(mult(baseX, right), mult(baseY, bottom)), origin)
    ] */
    return {
        width: right - left,
        height: top - bottom
    }
}

geometry.getMinBoundingBox = paths =>{
    const hull = geometry.grahamScan(paths.flat());

    let minArea = Number.MAX_VALUE;
    let result;
    for(let i = 0; i < hull.length; i++){
        const box = geometry.getCoincidentBox(hull, i, (i+1) % hull.length)
        const area = box.width * box.height;
        if(area < minArea){
            minArea = area
            result = box
        }
    }
    return result
}

geometry.getLength = hull =>{
    let length = 0;
    hull.forEach((point, i)=>{
        const nextI = (i+1) % hull.length
        length += distance(point, hull[nextI])
    })
    return length
}

geometry.triangleArea = (A, B, C)=>{
    const a = distance(A, B);
    const b = distance(B, C);
    const c = distance(A, C);
    const p = (a+b+c) / 2
    return Math.sqrt(p * (p-a) * (p-b) * (p-c)) 
}

geometry.getArea = hull =>{
    let area = 0;
    const A = hull[0]
    for(let i = 1; i < hull.length-1; i++){
        const B = hull[i]
        const C = hull[i+1]
        area += geometry.triangleArea(A, B, C)
    }
    return area
}

module.exports = geometry