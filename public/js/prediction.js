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
/* for (const lable in drawsStyles) {
    chartsColor.innerHTML+=`<h4 style="color:${drawsStyles[lable]}">${lable}</h4>\n`;
} */

const predicate = document.querySelector("button#predicate")
predicate.onclick = ()=>{
    const paths = sketch.paths
    if(!paths.length)
        return alert("draw something frist")
    predicate.disabled = true
    label.innerHTML= "is it..."
    fetch("/predicate/draw",{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({paths})
    }).then(res=>res.json()).then(({predictedLabel})=>{
        label.innerHTML=`is it ${predictedLabel}?`
        predicate.disabled = false
    })
}


makeChart.onclick = ()=>{
    makeChart.innerHTML = "Loading..."
    makeChart.disabled = true
    fetch("/predicate/chart",{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({paths: sketch.paths.length == 0? [[[0,0]]] : sketch.paths})
    }).then(res=>res.json()).then(({chartImage})=>{
        chart.src = chartImage
        makeChart.innerHTML = "Make Chart"
        makeChart.disabled = false
    })
}

const sketch = new SketchPad(sketchContainer, 500);

