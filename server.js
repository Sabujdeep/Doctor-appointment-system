const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const path = require('path')

// congig
dotenv.config()

// mongodb connection
connectDB()

// rest objects
const app = express()

// middleware
app.use(express.json())
app.use(morgan('dev'))

//ROUTES
// User routes
app.use('/api/v1/user', require('./routes/userRoutes'))
// admin routes
app.use('/api/v1/admin', require('./routes/adminRoutes'))
// doctors routes
app.use('/api/v1/doctor', require('./routes/doctorRoutes'))


// Static files
app.use(express.static(path.join(__dirname, './client/build')))

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})


// listen port 
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_MODE} mode on port ${process.env.PORT} `.bgCyan.white);
});