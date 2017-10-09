#!/usr/bin/env node
const bodyParser = require('body-parser')
const app = require('express')()
var redis = require('redis').createClient(process.env.REDIS_URL)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

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

app.post('/new/', function (req, res) {
	redis.hget('items', req.body.item.name, function (err, reply) {
		if (!err) {
			if (reply === null) {
				redis.hset('items', req.body.item.name, JSON.stringify(req.body.item.stats), function (err, reply) {
					if (!err) {
						res.send('SUCCESS')
					} else {
						res.send(err)
					}
				})
			} else {
				res.send('Item already exists. Use the /update endpoint.')
			}
		} else {
			res.send(err)
		}
	})
})

app.put('/update/', function (req, res) {
	redis.hget('items', req.body.item.name, function (err, reply) {
		if (!err) {
			if (reply === null) {
				res.send('Item does not exist')
			} else {
				redis.hset('items', req.body.item.name, JSON.stringify(req.body.item.stats), function (err, reply) {
					if (!err) {
						res.send('UPDATED')
					} else {
						res.send(err)
					}
				})
			}
		}
	})
})

app.listen(3000, function (){
	console.log('Listening on port 3000...')
})
