const express = require('express');
const app = express();
const session = require('express-session')
const sessionStore = require('connect-mongodb-session')(session)
const PORT = process.env.PORT || 3000;

const STORE = new sessionStore({
    uri:"mongodb://localhost:27017/drawing-prediction",//change database name here and in dbConnect.js in models folder to your database name
    collection:"sessions"
})

app.use(session({
    secret:'ed0d1d5cbbb81661fd20d8e8994238d6f3baa419bddbaa6d1bbe3aa9f78b6f2e',//change the secret string here
    cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: false,
    store:STORE
}))

const { getDrawingPage, saveToRawData} = require('./controller/draw')
const { getPredicatePage, predicateDrawing, suggestDrawings, saveDrawing, openDrawing} = require('./controller/predicate')
const { getAnalysisPage, getTestedSamples } = require('./controller/analysis')
const { isLoggedOut, isLoggedIn } = require('./controller/middelwares')
const { getSignup, postUser, getLogin, checkUser, getProfile, logout } = require("./controller/account")

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:false}))
app.use(express.static('./public'))
app.use(express.static('./data/dataset/images'))
app.use(express.static('./profiles-image'))
app.set("view engine", "pug")
app.set("views", "./views")

app.get('/', getDrawingPage)
app.get('/predicate', getPredicatePage)
app.post('/predicate/predict', predicateDrawing)
app.post('/predicate/suggest', suggestDrawings)
app.post('/predicate/save', isLoggedIn, saveDrawing)
app.get('/analysis', getAnalysisPage)
app.get('/analysis/samples', getTestedSamples)
app.post('/drawing/save', saveToRawData)

app.get('/signup', isLoggedOut, getSignup)
app.post('/signup', postUser)

app.get('/login', isLoggedOut, getLogin)
app.post('/login', checkUser)
app.get('/profile/:id', getProfile)
app.post('/profile/drawing', openDrawing)

app.get('/logout', logout)

app.all('*',(req,res)=>{
    res.status(404).render("error", {error: "Page not found!"});
})
app.listen(PORT,()=>{console.log('server running on port '+PORT)})