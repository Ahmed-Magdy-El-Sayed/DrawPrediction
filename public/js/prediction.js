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
        label.innerHTML=`Getting similar drawings to ${predictedLabel}...`
        document.querySelector(".download").dataset.label = predictedLabel

        fetch("/predicate/suggest",{
            method:'post',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({point, label: predictedLabel})
        }).then(res=>res.json()).then(suggests=>{
            suggestsContainer.previousElementSibling.style.display = "block";
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
const downloadSketch = ()=>{
    const link = document.createElement("a")
    link.href = sketch.canvas.toDataURL()
    link.download = drawingInputName.value+"-drawing"
    document.body.appendChild(link)
    link.click()
    link.remove()
}

const save = target=>{
    if(!document.getElementById("drawingInputId"))
        return document.querySelector(".container").insertAdjacentHTML("afterbegin", `
            <h3 class="alert alert-info">
                Create account to save your drawing
                <span class="alert-close" onclick="this.parentElement.remove()">X</span>
            </h3>
        `)
    if(drawingInputName.value.trim() == "")
        return document.querySelector(".container").insertAdjacentHTML("afterbegin", `
            <h3 class="alert alert-info">
                empty drawing name is not allowed
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
    }).then(res=>{
        if(res.status == 201){
            document.querySelector(".container").insertAdjacentHTML("afterbegin", `
                <h3 class="alert alert-success">
                    The drawing saved successfully 
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
            target.insertAdjacentHTML("beforebegin", `
                <button class="alert-close" onclick="deleteDrawing(this)">delete</button>
                `)
            return res.json();
        }else if(res.status == 403)
            document.querySelector(".container").insertAdjacentHTML("afterbegin", `
                <h3 class="alert alert-info">
                    Create account to save your drawing
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
        else
            document.querySelector(".container").insertAdjacentHTML("afterbegin", `
                <h3 class="alert alert-faild">
                    Something went wrong
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
    }).then(({id})=>{
        if(id && document.getElementById("drawingInputId"))
            drawingInputId.value = id
    })
}

const deleteDrawing = target=>{
    if(!document.getElementById("drawingInputId") || (drawingInputId && !drawingInputId.value))
        return document.querySelector(".container").insertAdjacentHTML("afterbegin", `
            <h3 class="alert alert-info">
                No drawing to delete
                <span class="alert-close" onclick="this.parentElement.remove()">X</span>
            </h3>
        `)
    if(!confirm("Are you sure you want to delete this drawing?"))
        return;
    fetch("/profile/drawing",{
        method:'delete',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({id: drawingInputId.value})
    }).then(res=>{
        if(res.status == 200){
            document.querySelector(".container").insertAdjacentHTML("afterbegin", `
                <h3 class="alert alert-success">
                    The drawing deleted successfully 
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
            sketch.clear()
            drawingInputId.value = ""
            drawingInputName.value = new Date().getTime();
            document.querySelector(".download").dataset.label = "";
            label.innerText = "";
            suggestsContainer.previousElementSibling.style.display = "none";
            suggestsContainer.innerHTML = ""
            target.remove();
        }else if(res.status == 403)
            document.querySelector(".container").insertAdjacentHTML("afterbegin", `
                <h3 class="alert alert-info">
                    Create account to delete your drawing
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
        else if(res.status == 400)
            document.querySelector(".container").insertAdjacentHTML("afterbegin", `
                <h3 class="alert alert-info">
                    No drawing to delete
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
        else
            document.querySelector(".container").insertAdjacentHTML("afterbegin", `
                <h3 class="alert alert-faild">
                    Something went wrong
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
    })
}