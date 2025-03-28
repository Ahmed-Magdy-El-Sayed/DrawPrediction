class NeuralNetwork{
    constructor(neuronCounts){
        this.levels= [];
        for(let i = 0; i < neuronCounts.length-1; i++)
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i+1]))
    }
    static feedForword(givenInputs, network){
        const levelsCount = network.levels.length;
        let outputs = Level.feedForword(givenInputs, network.levels[0], false)
        for(let i = 1; i < levelsCount; i++)
            outputs = Level.feedForword(outputs, network.levels[i], i == levelsCount-1? true:false)
        
        return outputs
    }
}
class Level{
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for(let i = 0; i < inputCount; i++){
            this.weights[i] = new Array(outputCount)
        }

        Level.#randomize(this)
    }
    static #randomize = level=>{
        for(let i = 0; i < level.inputs.length; i++)
            for(let j = 0; j < level.outputs.length; j++)
                level.weights[i][j] = Math.random()*2 -1

        for(let i = 0; i < level.biases.length; i++) 
            level.biases[i] = Math.random()*2 -1
    }
    static feedForword(givenInputs, level, last){
        for(let i = 0; i < level.inputs.length; i++)
            level.inputs[i] = givenInputs[i]
        let expSum = 0;
        for(let i = 0; i < level.outputs.length; i++){
            let sum = 0;
            for(let j = 0; j < level.inputs.length; j++)
                sum += level.inputs[j] * level.weights[j][i];
            if(last){
                expSum += level.outputs[i] = Math.exp(sum + level.biases[i])
            }else
                level.outputs[i] = Math.tanh(sum + level.biases[i]) // tanh activation
        }
        if(last){
            level.outputs = level.outputs.map(exp=> parseFloat(exp/expSum))// softmax activation
            return level.outputs 
        }else{
            return level.outputs
        }
    }
    
}

module.exports = NeuralNetwork