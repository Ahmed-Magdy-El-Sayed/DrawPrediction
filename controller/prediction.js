const classify = require("../ml/ANN");
const suggest = require("../ml/KNN");
const featuresCollector = require("../ml/featuresCollector")
const {addDrawing, getDrawing, deleteDrawing} = require("../model/drawings")

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
            featuresCollector.getPathsCount(paths),
            featuresCollector.getPointsCount(paths),
            featuresCollector.getElongation(paths),
            featuresCollector.getRoundness(paths),
            featuresCollector.getComplexity(ANNPoint)
        ]
        const pLabel = classify(ANNPoint)
        res.json({point: KNNPoint, predictedLabel: pLabel})
    },
    suggestDrawings: (req, res)=>{
        const suggests = suggest(req.body, 30)
        res.json(suggests)
    },
    saveDrawing: (req, res)=>{
        addDrawing({...req.body, authorId: req.session.user._id}).then(drawing=>{
            res.status(201).send({id: drawing._id})
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
    },
    removeDrawing: (req, res)=>{
        if(!(req.body.id.match(/^[0-9a-fA-F]{24}$/)))
            return res.status(400).send("Bad Request! try again.");
        
        deleteDrawing(req.body.id).then(deleted=>{
            if(deleted)
                res.status(200).end()
            else
                res.status(400).send("Bad Request! try again.")
        }).catch(err=>{
            console.log(err)
            res.status(500).send("Internal server error")
        })
    }
}