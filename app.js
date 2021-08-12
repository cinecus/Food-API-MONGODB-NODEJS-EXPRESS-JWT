require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

//security
const cors = require('cors')

//db connect
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')
const foodRouter = require('./routes/food')

//error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


app.use(express.json())

//security
app.use(cors())

app.get('/',(req,res)=>{
    res.send('<h1>Backend Project Template</h1><a href="/api/v1/index">Go !!</a>"')
})

//routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/food',authenticateUser,foodRouter)

//middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)



const port = process.env.PORT || 3000

const start = async() =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()