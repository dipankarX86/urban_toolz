// console.log('hello world')
const express = require('express')  // express is the backend web framework
const colors = require('colors')
const dotenv = require('dotenv').config()  // allows us to have a .env file at the root with our environment variables
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.port || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// app.get('/api/goals', (req, res) => {
//     // res.send('Get Goals')
//     res.json({message: 'Get Goals'})
// })
app.use('/api/goals', require('./routes/goalRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`server started in port ${port}`))
