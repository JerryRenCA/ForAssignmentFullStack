require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const dbRouter = require('./routes/dbRoute')
const tableRouter = require('./routes/tableRoute')


app.use(cors())
app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'views', 'public')))

app.use('/db', dbRouter)
app.use('/table', tableRouter)

app.all("*", (req, res) => { res.sendFile(path.join(__dirname, 'views', '404.html')) })

app.listen(process.env.PORT, () => { console.log(`Server is listening on PORT:${process.env.PORT}`) })