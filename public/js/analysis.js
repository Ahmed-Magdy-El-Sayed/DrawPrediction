function getTestedSamples(ele) {
    ele.innerHTML = "loading...";
    ele.disabled = true;
    fetch("/analysis/samples")
    .then(res=>res.json())
    .then(samples=>{
        samples.forEach(sample=>{
            const color = sample.label == sample.predicted? "forestgreen" : "firebrick";
            ele.insertAdjacentHTML("beforebegin", `
                <div style="width: fit-content; text-align: center; background-color: white; border: 2px solid ${color}">
                    <h3 style="margin: 0; color: ${color}">${sample.predicted}</h3>
                    <img style="width: 100px; height: 100px" src="/${sample.key_id}.png"></img>
                </div>
                `)
        })
        ele.remove()
    })
    .catch(err=>{
        console.error(err)
    })
}