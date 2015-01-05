var express = require('express'),
    session = require('express-session'),
    bodyParser = require("body-parser"),
    partials = require('express-partials'),
    app = express()

app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require('flash')())
app.use(partials())
app.use(express.static(__dirname + '/public'))
app.set('views', './views')
app.set('view engine', 'jade')

app.get('/', function (req, res) {
  res.render('index', { })
})

app.post('/send', function (req, res) {
  var request = require('request');
  var mobileNumber = '+' + req.body.country + req.body.number
  var message = req.body.message
  request.post({
    headers: {
      'content-type' : 'application/x-www-form-urlencoded',
      'Accepts': 'application/json'
    },
    url:     process.env.BLOWERIO_URL + '/messages',
    form:    {
      to: mobileNumber,
      message: message
    }
  }, function(error, response, body){
    if (!error && response.statusCode == 200)  {
      req.flash('info', 'Message sent!')
    } else {
      var apiResult = JSON.parse(body)
      req.flash('error', apiResult.message)
    }
    res.redirect('/')
  })
})

var server = app.listen((process.env.PORT || 3000), function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
