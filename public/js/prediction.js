const sketch = new SketchPad(sketchContainer, 500);

let drawing=  sketchContainer.dataset.drawing;
drawing = drawing? JSON.parse(drawing) : null

if(drawing)
    sketch.addDraw(drawing.paths)

const suggest = document.querySelector("button#suggest")
suggest.onclick = ()=>{
    const paths = sketch.paths
    if(!paths.length)
        return alert("draw something frist")
    suggest.disabled = true
    label.innerHTML= "Recognizing..."
    fetch("/predicate/predict",{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({paths})
    }).then(res=>res.json())
    .then(({point, predictedLabel})=>{
        label.innerHTML=`Get similar drawings for ${predictedLabel}...`
        document.querySelector(".download").dataset.label = predictedLabel

        fetch("/predicate/suggest",{
            method:'post',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({point, label: predictedLabel})
        }).then(res=>res.json()).then(suggests=>{
            suggests.forEach(drawing => {
                suggestsContainer.innerHTML += `
                <img style="width: 100px;" onclick="useSuggest(${JSON.stringify(drawing.paths)})" src="/${drawing.id}.png">
                `
            });
            suggest.disabled = false
        })
    })
}
const useSuggest = paths=>{
    sketch.addDraw(paths)
}
const download = ()=>{
    const link = document.createElement("a")
    link.href = sketch.canvas.toDataURL()
    link.download = drawingInputName.value+"-drawing"
    document.body.appendChild(link)
    link.click()
    link.remove()
}

const save = ()=>{
    if(!document.getElementById("drawingInputId"))
        return document.querySelector(".navbar").insertAdjacentHTML("afterend", `
                <h3 class="alert-info">
                    Create account to save your drawing
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
    fetch("/predicate/save",{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            _id: drawingInputId.value, 
            name: drawingInputName.value, 
            img: sketch.canvas.toDataURL(), 
            paths: sketch.paths
        })
    }).then(res=>{console.log(res.status)
        if(res.status == 201){
            if(res.body)
                _id = res.id
            document.body.insertAdjacentHTML("afterend", `
                <h3 class="alert-success">
                    The drawing saved successfully 
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
        }else if(res.status == 406)
            document.body.insertAdjacentHTML("afterend", `
                <h3 class="alert-faild"> 
                    the name is already used 
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
        else if(res.status == 403)
            document.body.insertAdjacentHTML("afterend", `
                <h3 class="alert-info">
                    Create account to save your drawing
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
        else
            document.body.insertAdjacentHTML("afterend", `
                <h3 class="alert-faild">
                    Something went wrong
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
    })
}
