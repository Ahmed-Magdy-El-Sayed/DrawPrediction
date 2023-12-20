const editDrawing = drawingId=>{
    fetch("/profile/drawing",{
        method:'post',
        headers:{'Content-Type':'text/plain'},
        body: drawingId
    }).then(res=>{console.log(res)
        if(res.status = 301)
            location.href = "/predicate"
        else
            document.body.insertAdjacentHTML("afterbegin", `
                <h3 class="alert-success">
                    ${res.body}
                    <span class="alert-close" onclick="this.parentElement.remove()">X</span>
                </h3>
            `)
    }).catch(err=>{
        console.log(err)
    })
}