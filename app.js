require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()



//routers
const indexRouter = require('./routes/index')

//error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


app.use(express.json())

app.get('/',(req,res)=>{
    res.send('<h1>Backend Project Template</h1><a href="/api/v1/index">Go !!</a>"')
})

//routes
app.use('/api/v1/index',indexRouter)

//middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async() =>{
    try {
        app.listen(port,console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()