const chartEvent = new Event("makeChart")
let googleChart;
let dataTable;
notify.innerHTML = "Getting Data..."
// const {featuresName, samples} = features;
for (const lable in utilts.styles) {
    chartsColor.innerHTML+=`<h4 style="color:${utilts.styles[lable]}">${lable}</h4>\n`;
}
notify.innerHTML = "you have 10 secounds to draw before view the result on the chart"
/* console.log(featuresName)
const options ={
    width:400,
    height:400,
    hAxis:{
        title:featuresName[0] 
    },
    vAxis:{
        title:featuresName[1] 
    },
    length:{position:"none"},
    explorer:{
        maxZoomIn:0.01,
        actions:["dragToZoom","rightClickToReset"]
    }
} */

googleChart = ()=>{
    dataTable = new google.visualization.DataTable();
    dataTable.addColumn("number",featuresName[0]);
    dataTable.addColumn("number",featuresName[1]);
    dataTable.addColumn({"type":"string","role":"style"})
    dataTable.addRows(samples.map(sample=>{
        return [
            ...sample.points,
            utilts.styles[sample.lable]
        ]
    }));
    const chart = new google.visualization.
    ScatterChart(chartContainer);
    chart.draw(dataTable, options)
}
let chartRunning = false;
let secounds = 10;
drawChart = newPoint=>{
    notify.innerHTML = `you have ${secounds} secounds to draw before view the result on the chart`
    if(!samples[samples.length-1].id) samples.pop();
    samples.push({points: newPoint,lable: "test"});
    if(!chartRunning){
        chartRunning = true;
        let timeCounter = setInterval(() => {
            notify.innerHTML = `you have ${secounds--} secounds to draw before view the result on the chart`
            if(secounds === 0){
                clearInterval(timeCounter);
                notify.innerHTML = `you have 0 secounds to draw before view the result on the chart`
                secounds = 10;
            }
        }, 1000);
        setTimeout(() => {
            console.log("test point: ",newPoint)
            google.charts.load("current",
                {"packages":["coreChart"]}
            )
            google.charts.setOnLoadCallback(googleChart);
            chartRunning = false;
        },secounds*1000);
    }
}

/* const groups = utilts.groupBy(samples, "session_id");
for (const samples in groups) {
    const div = document.createElement("div");
    div.setAttribute("class","group")
    div.innerHTML=`
    <h3>${groups[samples][0].student_name}</h3>
    `
    groups[samples].forEach(sample => {
        div.innerHTML+=`
        <img id='${sample.id}' src='${constants.IMG_DIR}/${sample.id}.png'></img>
        `
    });
    container.appendChild(div)
} */

const onDrawingUpdate = (paths)=>{// paths of the new draw that the app will predicate it's label
    const point =[
        featuresCollector.getNewWidth(paths),
        featuresCollector.getNewHeight(paths)
    ]
    drawChart(point);
    const indices = utilts.getNearest(point, samples, 10)// indices of the nearest drawings
    const labels = indices.map(i=>samples[i].label);// labels of the nearest drawings

    let counts = {};// the number of repeating the labels
    for (const label of labels) {
        counts[label] = counts[label]? counts[label]+1 :1
    }
    const Max = Math.max(...Object.values(counts))// the heighest repeated drawing
    const nearestLabel = labels.find(l=>counts[l]==Max)
    console.log(indices, labels, Max)
    predectedLabel.innerHTML=`is it ${nearestLabel}?`
}

const sketch = new SketchPad(sketchContainer/* , onDrawingUpdate */);

