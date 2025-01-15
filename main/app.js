const express = require('express')
const dotenv = require('dotenv')
const routes = require('./routes/index')
require('dotenv').config()

const app = express()
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views','./views')

app.use('/', routes)

//Listen
const port = process.env.PORT || 0;
 app.listen(port, () => {
    console.log((`Server is running on ${port}`))
})