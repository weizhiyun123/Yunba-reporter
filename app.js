var express = require('express')
var app = express()
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var Client = require('socket.io-client')
var redis = require("redis"),
    rdclient = redis.createClient();

app.use(bodyParser.json());

app.post('/', function(req, res) {
    if (!req.body.appkey) return res.status(400).send('appkey notfound!')
    ioclient = Client.connect('wss://abj-rest-fc1.yunba.io:3003/', {'force new connection': true})
    ioclient.on('connect', function(){
        console.log('server connected')
        ioclient.emit('connect_v2', {'appkey': req.body.appkey, 'customid': 'userid'})})
        ioclient.on('connack', function(msg) {
            console.log(msg['success'])
            if (msg['success']) {
                ioclient.emit('subscribe', {'topic': ',report/topic1'})
                ioclient.on('suback', function(msg){
                    console.log(msg['success'])
                    if (msg['success']) {
                        res.send(req.body.appkey);
                    } else {
                         res.status(400).send('internal error')
                    }
                })
            } else {
                 console.log('error')
                 res.status(400).send('wrong appkey')
            }
        })
    ioclient.on('message', function(msg){
        str =  req.body.appkey + '/' + msg['msg']
        console.log(str)
        rdclient.incr(str, redis.print)
    })

    console.log(req.body)
})

app.get('/query/:segament', function(req, res) {
    str = req.params.segament
    console.log(str)
    rdclient.on('error', function(err) {
        console.log(err)
        res.status(400).send(err)
    })
    if (typeof(str) != "undefined") {
        rdclient.get(str, function(err, reply) {
            if (reply != null) {
                res.send({str: reply})
                console.log(reply)
            } else {
                res.status(400).send("no such operation")
            }
        })
    } else {
        res.status(400).send("invaild segament")
    }
})

http.listen(4000, function (){
    console.log('Example app is running and listing port 4000')
})

