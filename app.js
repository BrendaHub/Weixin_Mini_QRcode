var express = require('express')
var router = require('./router/index.js')
var path = require('path');
var app = express()

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, '/views/pages/'))
app.use('/public',express.static(path.join(__dirname, '/public')));

app.use('/', router)
app.listen(8001)