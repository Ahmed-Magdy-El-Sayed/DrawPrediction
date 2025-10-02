const constants = require("../common/constants");
const fs = require("fs");
const path = require("path");
const samples = require(constants.KNN_SAMPLES).samples
const { distance } = require("../common/utilts");

function logTransform(data, indexes) {
    return data.map(row => {
        const newRow = [...row];
        for (const idx of indexes) {
            newRow[idx] = Math.log1p(newRow[idx]);
        }
        return newRow;
    });
}

function computeMeanStd(data) {
    const numFeatures = data[0].length;
    const n = data.length;

    const means = new Array(numFeatures).fill(0);
    const stds = new Array(numFeatures).fill(0);

    // Compute means
    for (let i = 0; i < numFeatures; i++) {
        means[i] = data.reduce((sum, row) => sum + row[i], 0) / n;
    }

    // Compute std deviations
    for (let i = 0; i < numFeatures; i++) {
        const variance = data.reduce((sum, row) => {
        return sum + Math.pow(row[i] - means[i], 2);
        }, 0) / n;

        stds[i] = Math.sqrt(variance);
    }

    return { means, stds };
}

function standardize(data, means, stds) {
    return data.map(row =>
        row.map((value, i) => parseFloat(((value - means[i]) / (stds[i] || 1)).toFixed(4))) // avoid divide by zero
    );
}



const getNearest=({point : loc, label}, samplesProp, k=5)=>{
    const labeledSamples = samplesProp[label];
    
    // normalization
    // Apply log1p to PointsNum (1) and Complexity (4)
    const logTransformed = logTransform([loc, ...labeledSamples.map(sample=>sample.KNNPoint)], [1, 4]);
    
    const { means, stds } = computeMeanStd(logTransformed);
    const standardized = standardize(logTransformed, means, stds);

    const newLoc = standardized.shift();

    const sorted = standardized.sort((a,b)=>
        distance(newLoc, a) - distance(newLoc, b)
    )
    const ids = sorted.map((_, i)=>labeledSamples[i].key_id);
    return ids.slice(0,k);
}

const suggest = (drawing, k=5)=>{
    const ids = getNearest(drawing, samples, k)// ids of the nearest drawings
    return ids.map(id=>{
        return {
            id,
            paths: JSON.parse(fs.readFileSync(path.join(__dirname,constants.KNN_JSON_DIR, id+".json")))
        }
    });
}

module.exports = suggest