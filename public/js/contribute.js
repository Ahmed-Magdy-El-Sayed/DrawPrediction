const sketch = new SketchPad(sketchContainer, 500);
sketchContainer.style.display= "none";
sketchContainer.style.marginTop= "10px";
const data ={
    label:null,
    timestamp: new Date().toLocaleString("en"),
    countryCode: new Intl.DateTimeFormat().resolvedOptions().locale,
    key_id: new Date().getTime(),
    drawing:{}
}
function start(){
    if(!document.querySelector("#details input")){
        location.reload()
        return null
    }
    const checkedRadio = document.querySelector("#details input:checked")
    if(!checkedRadio){
        alert("you should define what you will draw frist")
        return null
    }
    if(checkedRadio.value == "others"){
        const textInput = document.querySelector("#details input[type='text']")
        if(!textInput.value){
            alert("You should enter the draw name")
            return null
        }
        data.label = textInput.value
    }else
        data.label = checkedRadio.value
    sketchContainer.style.display = "block";
    details.innerHTML=`
    <h3 id="whatToDraw" style='display:inline-block;'>Draw a ${data.label}</h3>
    <button class="blue" onclick="done()">Done</button>
    `
    startBtn.style.display = "none"
}
function done(){
    if(!sketch.paths.length)
        return alert("Please draw a/an "+data.label);
    data.drawing = sketch.paths;
    fetch("/contribute/save",{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    data.timestamp= new Date().toLocaleString("en")
    data.key_id= new Date().getTime()
    data.drawing = {}
    sketch.reset();
    sketchContainer.style.display = "none";
    details.innerHTML=`
    <h3 id="whatToDraw" style="display:inline-block;">Thank You!</h3>
    `
    startBtn.innerHTML = "add another one"
    startBtn.style.display = null
}
