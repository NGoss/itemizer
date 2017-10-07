#!/usr/bin/env node
const app = require('express')()
var redis = require('redis').createClient(process.env.REDIS_URL)

redis.on('error', function(error) {
	console.log(error)
})

app.get('/', function (req, res) {
	res.send('What do you want?')
})

app.get('/items', function (req, res) {
	redis.hgetall('items', function (err, reply) {
		if (!err) {
			res.send(reply)
		} else {
			res.send(err)
		}
	})
})

app.get('/items/:item', function (req, res){
	redis.hget('items', req.params.item, function (err, reply) {
		if (!err) {
			res.send(reply)
		} else {
			res.send(err)
		}
	})
})

app.listen(3000, function (){
	console.log('Listening on port 3000...')
})
