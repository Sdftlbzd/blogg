import express from 'express'
import mongoose from 'mongoose'

import 'dotenv/config'
import { Mainrouter } from './src/routes/index.js'

const app = express()
app.use(express.json())



mongoose.connect(process.env.MYURL)
.then(()=>{
console.log("Connet to DB")
})
.catch((error)=>{
console.error(`Error bash verdi ${error}`)
})

app.use('/', Mainrouter)
const port= process.env.PORT

app.listen(port, () => console.log(`Server is running on port ${port}`));