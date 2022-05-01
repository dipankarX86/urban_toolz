// console.log('hello world')
const express = require('express')  // express is the backend web framework
const path = require('path')
const colors = require('colors')
const dotenv = require('dotenv').config()  // allows us to have a .env file at the root with our environment variables
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.port || 5000
//
// for MPA frontend landing page some testing
const exphbs = require('express-handlebars');
const Goal = require('./models/goalModel')
//
//this part is required for anything to work before anything
connectDB()
const app = express()

//
// handlebar middleware
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));  // I had to add .engine to exphbs
app.set('view engine', 'handlebars');
app.use('/', express.static(path.join(__dirname, '../public')))
//
//retrieve all goals
const goalsAll = async (req, res) => {
    const goals = await Goal.find().lean()
    return goals
}
//
// homepage route
app.get('/', async (req, res) => res.render('index', {
    title: 'All Goals',
    goals: await goalsAll()
}));

//
// Body parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

//  Serve dashboard
if(process.env.NODE_ENVIRONMENT === 'production') {
    app.use('/', express.static(path.join(__dirname, '../dashboard/build')))

    app.get('/dashboard*', (req, res) => 
        res.sendFile(
            path.resolve(__dirname, '../', 'dashboard', 'build', 'index.html')
        )
    )
} else {
    app.get('/dashboard*', (req, res) => res.send('Please set to production'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`server started in port ${port}`))
