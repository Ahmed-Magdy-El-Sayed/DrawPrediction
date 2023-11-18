const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { getDrawPage, saveDraw } = require('./controller/draw')
const { getPredicatePage, predicateDraw, getChart } = require('./controller/predicate')
const { getDetailsPage } = require('./controller/details')

app.use(express.json())
app.use(express.static('./public'))
app.set("view engine", "pug")
app.set("views", "./views")

app.get('/', getDrawPage)
app.get('/predicate', getPredicatePage)
app.post('/predicate/draw', predicateDraw)
app.post('/predicate/chart', getChart)
app.get('/details', getDetailsPage)
app.post('/draw/save', saveDraw)

app.all('*',(req,res)=>{
    res.status(404).send('<h1 style="text-align: center; color: red;">page not found !!</h1>');
})
app.listen(PORT,()=>{console.log('server running on port '+PORT)})