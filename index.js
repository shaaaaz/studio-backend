const express = require("express")
const { connectDB , disconnecYtDB , isConnected} = require('./db.js')
const app = express()
const Router = require('./routes.js')
const PORT = 3000
const cors = require('cors')

app.use(cors())

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin",'https://studio-frontend-phi.vercel.app','https://studio-frontend-phi.vercel.app/signup','https://studio-frontend-phi.vercel.app/login','http://localhost:5173/login','http://localhost:5173/signup', "https://studio-frontend-ampy6loh9-shaazs-projects-888212a7.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.sendStatus(200)
  })     


// app.use(cors({
//     origin: ['https://studio-frontend-phi.vercel.app','https://studio-frontend-phi.vercel.app/signup','https://studio-frontend-phi.vercel.app/login','http://localhost:5173/login','http://localhost:5173/signup','https://studioo-h3vda8igl-shaazs-projects-888212a7.vercel.app/','http://localhost:5173'],
//     methods: 'GET, POST, PUT, DELETE',
//     allowedHeaders: 'Content-Type',
//     credentials: true,
// }))

const bodyParser = require('body-parser')

app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))


const printStatus = async() => {
    await connectDB()
    console.log("MongoDB Connection Status -> ",isConnected())
}

printStatus()

app.get('/',(req,res)=>{
    res.send("HELLO WORLD")
    console.log("working")
})

app.use(cors())
app.use(Router)

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})