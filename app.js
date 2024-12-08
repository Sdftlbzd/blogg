import express from 'express'
import mongoose from 'mongoose'
import { Mainrouter } from './src/routes/index.js'
import { Config } from './src/config.js'

const app = express()
app.use(express.json())
mongoose.connect(Config.MYURL)
.then(()=>{
console.log("Connet to DB")
})
.catch((error)=>{
console.error(`Error bash verdi ${error}`)
})
app.use('/', Mainrouter)
const port= Config.PORT

app.listen(port, () => console.log(`Server is running on port ${port}`));