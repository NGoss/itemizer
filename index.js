const app = require('express')()
var redis = require('redis).createClient(${REDIS_URL})

redis.on('error', function(error) {
	console.log(error)
})

app.get('/items', function (req, res) {
	redis.get('items')
})

app.get('/items/:item', function (req, res){
	redis.hget('items', req.params.item)
})
