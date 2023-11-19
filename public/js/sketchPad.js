class SketchPad{
    constructor(container, size=400){
        this.canvas= document.createElement("canvas")
        this.canvas.width= size;
        this.canvas.height= size;
        this.canvas.style=`
            background-color:white;
            box-shadow:0 0 10px 2px black;
        `;
        container.appendChild(this.canvas)
        this.ctx = this.canvas.getContext("2d")
        this.paths=[];
        this.undoPaths=[]
        this.isDrawing=false;
        this.#addEventListeners();
    }

    #addEventListeners(){
        this.canvas.onmousedown= e=>{
            this.undoPaths = [];
            redoBtn.disabled = true;
            this.isDrawing = true;
            const mouse = this.#getMouth(e);
            this.paths.push([mouse]);
            this.#reDraw();
            undoBtn.disabled = false;
        }

        this.canvas.onmousemove= e=>{
            if(this.isDrawing){
                const mouse = this.#getMouth(e);
                const lastPath = this.paths[this.paths.length-1];
                lastPath.push(mouse);
                this.#reDraw();
            }
        }
        document.onmouseup= ()=>{
            this.isDrawing = false;
        }

        this.canvas.ontouchstart= e=>{
            this.undoPaths = [];
            redoBtn.disabled = true;
            const loc = e.touches[0];
            this.canvas.onmousedown(loc)
        }
        this.canvas.ontouchmove= e=>{
            const loc = e.touches[0];
            this.canvas.onmousemove(loc);
        }
        this.canvas.ontouchend=()=>{
            this.canvas.onmouseup();
        }

        const options = document.createElement("span")
        options.classList.add("options")

        const undoBtn = document.createElement("button");
        undoBtn.innerHTML="UNDO";
        undoBtn.setAttribute("class","undo red")
        undoBtn.disabled = true;
        options.appendChild(undoBtn)


        const redoBtn = document.createElement("button");
        redoBtn.innerHTML="REDO";
        redoBtn.setAttribute("class","redo blue")
        redoBtn.disabled = true;
        options.appendChild(redoBtn)

        this.canvas.before(options);

        undoBtn.onclick=()=>{
            redoBtn.disabled = false;
            this.undoPaths.push(this.paths.pop());
            this.#reDraw();
            if(this.paths.length < 1){
                undoBtn.disabled = true;
            }
        }
        redoBtn.onclick=()=>{
            if(this.undoPaths.length <= 0)
                return null
            undoBtn.disabled = false;
            this.paths.push(this.undoPaths.pop());
            this.#reDraw();
            if(this.undoPaths.length < 1){
                redoBtn.disabled = true;
            }
        }
    }
    #path=(ctx, path, color="black")=>{
        ctx.strokeStyle = color;
        ctx.lineWidth=5;
        ctx.beginPath();
        ctx.moveTo(...path[0]);
        // ctx.lineTo(...path[0]);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(...path[i]);
        }
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.stroke();
    }
    
    #paths= (ctx, paths, color="black")=>{
        for (const path of paths) {
            this.#path(ctx, path, color="black")
        }
    }
    reset(){
        this.paths=[];
        this.#reDraw();
    }
    #reDraw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.#paths(this.ctx,this.paths);
    }
    #getMouth = e =>{
        const rect = this.canvas.getBoundingClientRect();
        return [
            Math.round(e.clientX - rect.x),
            Math.round(e.clientY - rect.y)
        ];
    }
}