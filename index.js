const app = require('express')()
var redis = require('redis').createClient(process.env.REDIS_URL)

redis.on('error', function(error) {
	console.log(error)
})

app.get('/', function (req, res) {
	res.send('What do you want?')
})

app.get('/items', function (req, res) {
	res.send(redis.hgetall('items'))
})

app.get('/items/:item', function (req, res){
	res.send(redis.hget('items', req.params.item))
})

app.listen(3000, function (){
	console.log('Listening on port 3000...')
})
