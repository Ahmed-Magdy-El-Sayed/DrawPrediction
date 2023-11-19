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

