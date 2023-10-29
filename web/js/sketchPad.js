class SketchPad{
    constructor(container, onUpdate=null, size=400){
        this.onUpdate=onUpdate;
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
        this.isDrawing=false;
        this.#addEventListeners();
    }

    #addEventListeners(){
        this.canvas.onmousedown= e=>{
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

        const undoBtn = document.createElement("button");
        undoBtn.innerHTML="UNDO";
        undoBtn.setAttribute("class","undo")
        undoBtn.disabled = true;
        this.canvas.after(undoBtn);

        undoBtn.onclick=()=>{
            this.paths.pop();
            this.#reDraw();
            if(this.paths.length < 1){
                undoBtn.disabled = true;
            }
        }
    }
    reset(){
        this.paths=[];
        this.#reDraw();
    }
    #reDraw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        draw.paths(this.ctx,this.paths);
        if(this.onUpdate){
            this.onUpdate(this.paths)
        }
    }
    #getMouth = e =>{
        const rect = this.canvas.getBoundingClientRect();
        return [
            Math.round(e.clientX - rect.x),
            Math.round(e.clientY - rect.y)
        ];
    }
}