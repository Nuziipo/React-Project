const express = require('express')
const app = express()
const cors= require('cors')
const bodyParser= require('body-parser')
const mongoose = require('mongoose')

const PORT = 3009
const routes = require('./routes')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/itservice', {
    useMongoClient: true
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: '*/*' }))
routes(app)

app.listen(PORT, () => {
    console.log('ready server on http://localhost:' + PORT)
})