const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;

const { getDrawPage, saveDraw } = require('./controller/draw')

app.use(express.static('./web'))
app.use(express.json())

app.get('/', getDrawPage)
app.get('/draw/save', saveDraw)

app.all('*',(req,res)=>{
    res.status(404).send('<h1 style="text-align: center; color: red;">page not found !!</h1>');
})
app.listen(PORT,()=>{console.log('server running on port '+PORT)})