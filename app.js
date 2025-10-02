const express = require('express');
const app = express();
const session = require('express-session')
const sessionStore = require('connect-mongodb-session')(session)
const PORT = process.env.PORT || 3000;
require("dotenv").config()

const STORE = new sessionStore({
    uri: process.env.MONGODB_URI,
    collection:"sessions"
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: false,
    store:STORE
}))

const { getHomePage } = require('./controller/home')
const { getDrawingPage, saveToRawData} = require('./controller/contribution')
const { getPredicatePage, predicateDrawing, suggestDrawings, saveDrawing, openDrawing, removeDrawing} = require('./controller/prediction')
const { getAnalysisPage/* , getTestedSamples  */} = require('./controller/analysis')
const { isLoggedOut, isLoggedIn } = require('./controller/middelwares')
const { getSignup, postUser, getLogin, checkUser, getProfile, logout, deleteAccount } = require("./controller/account")

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:false}))
app.use(express.static('./public'))
// app.use(express.static('./knn-samples/images'))
// app.use(express.static('./profiles-image'))
app.set("view engine", "pug")
app.set("views", __dirname+"/views")

app.get('/', getHomePage)
app.get('/contribute', getDrawingPage)
app.post('/contribute/save', saveToRawData)
app.get('/predicate', getPredicatePage)
app.post('/predicate/predict', predicateDrawing)
app.post('/predicate/suggest', suggestDrawings)
app.post('/predicate/save', isLoggedIn, saveDrawing)
app.get('/analysis', getAnalysisPage)
// app.get('/analysis/samples', getTestedSamples)

app.get('/signup', isLoggedOut, getSignup)
app.post('/signup', postUser)

app.get('/login', isLoggedOut, getLogin)
app.post('/login', checkUser)
app.get('/profile/delete-account', isLoggedIn, deleteAccount)
app.get('/profile/:id', getProfile)
app.post('/profile/drawing', openDrawing) 
app.delete('/profile/drawing', isLoggedIn, removeDrawing) 

app.get('/logout', logout)

app.all('/*any',(req, res)=>{
    res.status(404).render("error", {error: "Page not found!", user: req.session.user});
})
app.listen(PORT,()=>{console.log('server running on port '+PORT)})
module.exports = app