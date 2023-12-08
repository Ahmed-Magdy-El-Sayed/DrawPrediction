const confusionMatrix = container=>{
    const matrix = JSON.parse(container.dataset.matrix)
    const rowsSum = {};
    const columnsSum = {};
    const matDim = Object.keys(matrix).length+2
    container.style = `
        margin: auto;
        display: grid;
        grid-template-columns: 80px repeat(${matDim-1}, 1fr);
        grid-template-rows: repeat(${matDim}, 1fr);
        width: 500px;
        height: 500px;
        color: white;
        border: 1px solid;
    `
    container.innerHTML = `
        <h2 style="
            width: max-content;
            grid-row: 1/${matDim+1};
            grid-column: 1;
            margin: auto;
            transform: rotateZ(-90deg);
        ">true classes</h2>

        <h2 style="
            grid-column: 1/${matDim+1};
            grid-row: 1;
            margin: auto;
        ">predicted classes</h2>
    `
    const matVals = []
    for (const realLabel in matrix) {
        for (const predLabel in matrix[realLabel]){
            matVals.push(matrix[realLabel][predLabel])
        }
    }
    const maxMatVal = Math.max(...matVals)
    const mainMatVal = Math.min(...matVals)
    let i = 3;
    for (const realLabel in matrix) {
        let j = 2;
        for (const predLabel in matrix[realLabel]){
            const cellVal = matrix[realLabel][predLabel]
            if(j == 2)
                container.innerHTML+=` 
                    <h3 class="row-${realLabel.split(" ").join("-")}" style="margin: 0; grid-row-start: ${i}; grid-column-start: 2">${realLabel}</h3> 
                    <h3 class="column-${realLabel.split(" ").join("-")}" style="margin: 0; grid-row-start: 2; grid-column-start: ${i}">${realLabel}</h3> 
                `
            const a = (cellVal-mainMatVal) / (maxMatVal-mainMatVal)
            container.innerHTML+=`
                <span style="
                    grid-row-start: ${i}; 
                    grid-column-start: ${j+1}; 
                    ${i==j+1? 
                        `background-color: rgba(0, 255, 0, ${a})` :
                        `background-color: rgba(255, 0, 0, ${a})` 
                    }
                ">${cellVal}</span>
            `
            rowsSum[realLabel]= rowsSum[realLabel]? rowsSum[realLabel]+cellVal : cellVal
            columnsSum[predLabel]= columnsSum[predLabel]? columnsSum[predLabel]+cellVal : cellVal
            j++
        }
        i++
    }
    for (const label in columnsSum) {
        const columnVal = columnsSum[label]-rowsSum[label]

        const p = 2 * columnVal / rowsSum[label]
        const r = p >= 0? p *255 : 0
        const b = p <= 0? -p *255 : 0

        container.querySelector(".column-"+label.split(" ").join("-")).innerHTML+=`<br><span>${columnVal < 0? columnVal : "+"+columnVal}</span>`
        container.querySelector(".column-"+label.split(" ").join("-")+" span").style.color = `rgb(${r}, 0, ${b})`
        
        container.querySelector(".row-"+label.split(" ").join("-")).innerHTML+=`<br><span>${rowsSum[label]}</span>`
        container.querySelector(".row-"+label.split(" ").join("-")+" span").style.color = `black`
    }
}
confusionMatrix(MatrixContainerOld)
confusionMatrix(MatrixContainer)