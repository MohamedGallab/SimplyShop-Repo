var express = require('express');
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//assign port
app.listen(3000);

//GET
app.get('/', (req, res) => {
  res.render('index', { title: 'HomePage' })
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' })
});

app.get('/home', (req, res) => {
  res.render('home', { title: 'Login' })
});

app.get('/books', (req, res) => {
  res.render('books', { title: 'Login' })
});

app.get('/boxing', (req, res) => {
  res.render('boxing', { title: 'Login' })
});

app.get('/cart', (req, res) => {
  res.render('cart', { title: 'Login' })
});

app.get('/galaxy', (req, res) => {
  res.render('galaxy', { title: 'Login' })
});


app.get('/iphone', (req, res) => {
  res.render('iphone', { title: 'Login' })
});

app.get('/leaves', (req, res) => {
  res.render('leaves', { title: 'Login' })
});

app.get('/phones', (req, res) => {
  res.render('phones', { title: 'Login' })
});

app.get('/registration', (req, res) => {
  res.render('registration', { title: 'Login' })
});

app.get('/searchresults', (req, res) => {
  res.render('searchresults', { title: 'Login' })
});

app.get('/sports', (req, res) => {
  res.render('sports', { title: 'Login' })
});

app.get('/sun', (req, res) => {
  res.render('sun', { title: 'Login' })
});

app.get('/tennis', (req, res) => {
  res.render('tennis', { title: 'Login' })
});

//POST