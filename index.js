var express = require('express')
var app = express()

app.get('/', function(req, res) {
    res.send('Hello World')
    console.log('get req')
})

app.listen(3000, function (){
    console.log('Example app is running and listing port 3000')
})
