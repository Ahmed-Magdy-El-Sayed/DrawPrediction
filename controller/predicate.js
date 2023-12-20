const {classify, getSuggestes} = require("../common/utilts");
const featuresCollector = require("../common/featuresCollector")
const {addDrawing, updateDrawing, getDrawing} = require("../model/drawings")
let drawing;
module.exports = {
    getPredicatePage: (req, res)=>{
        res.render("prediction", {user: req.session.user, drawing})
        drawing = null
    },
    predicateDrawing: (req, res)=>{
        const {paths} = req.body
        const ANNPoint = Object.values(featuresCollector.getPixels(paths, 20))
        
        const KNNPoint = [
            [featuresCollector.getWidthAxis(paths), featuresCollector.getHeightAxis(paths)],
            featuresCollector.getElongation(paths),
            featuresCollector.getRoundness(paths),
            featuresCollector.getComplexity(ANNPoint)
        ]
        const pLabel = classify.NN(ANNPoint)
        res.json({point: KNNPoint, predictedLabel: pLabel})
    },
    suggestDrawings: (req, res)=>{
        const suggests = getSuggestes(req.body, 30)
        res.json(suggests)
    },
    saveDrawing: (req, res)=>{
        if(!req.body.session.user){
            res.status(401).end()
            return null
        }
        const isNew = req.body._id? false : true;
        if(isNew){
            delete req.body._id
            addDrawing({...req.body, authorId: req.session.user._id}).then(added=>{
                if(!added) res.status(301).end()
                else res.status(201).send(added._id)
            }).catch(err=>{
                console.log(err)
                res.status(500).end()
            })
        }else
            updateDrawing(req.body).then(()=>{
                res.status(201).end()
            }).catch(err=>{
                console.log(err)
                res.status(500).end()
            })
    },
    openDrawing: (req, res)=>{
        getDrawing(req.body).then(drawingObj=>{
            if(drawingObj && String(req.session.user._id) == drawingObj.authorId){
                drawing = drawingObj
                res.status(301).end()
            }else
                res.status(400).send("Bad Request! try again.")
        }).catch(err=>{
            console.log(err)
            res.status(500).send("Internal server error")
        })
    }
}