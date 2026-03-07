// > **HireDeyGo** — _Find your next opportunity. Hire your next star._

import express from 'express'
import mongoose from 'mongoose'

import { router } from "./routes/authRoutes.js"



const app = express()


//middleware
app.use(express.json());


// routes
app.get('/', (req, res) => {
    res.send("Hi Group 12 database1")
}) 
//app.use(router)
app.use('/api/v1/auth', router);



// database connection
const dbURI = 'mongodb+srv://thanksio:ZOnbwOai5f8n3CQa@hire-dey-go-be.0btetf4.mongodb.net/?appName=HIRE-DEY-GO-BE'
mongoose.connect(dbURI)
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));


