// console.log('hello world')
const express = require('express')  // express is the backend web framework
const path = require('path')
const exphbs = require('express-handlebars');
const colors = require('colors')
const dotenv = require('dotenv').config()  // allows us to have a .env file at the root with our environment variables
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.port || 5000

connectDB()

const app = express()

// handlebar middleware
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));  // I had to add .engine to exphbs
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// homepage route
app.get('/', (req, res) => res.render('index'));

// app.get('/api/goals', (req, res) => {
//     // res.send('Get Goals')
//     res.json({message: 'Get Goals'})
// })
app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

//app.use('/', express.static(path.join(__dirname, 'public')))    // this dont need to be static in express
                                                                // just learn, how to access individual pages or pages 
                                                                // through function in express router
                                                                // read on express router more

//  Serve frontend
if(process.env.NODE_ENVIRONMENT === 'production') {
    app.use('/', express.static(path.join(__dirname, '../frontend/build')))

    app.get('/dashboard', (req, res) => 
        res.sendFile(
            path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
        )
    )
} else {
    app.get('/dashboard', (req, res) => res.send('Please set to production'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`server started in port ${port}`))
