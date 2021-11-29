let express = require('express');
let path = require('path');
let app = express();
let { MongoClient } = require("mongodb");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//assign port
app.listen(3000);

//functions
async function login(username, password, req, res) {
  //start connection
  let url = "mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority";
  let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  //Query Users Collection
  if (username && password) {
    let results = await client.db('SimplyShopDB').collection('UsersColl').find({ username: username, password: password });
    if (results.count() > 0) {
      res.redirect('/home');
    }
    else {
      //window.alert('Incorrect Username and/or Password!');
    }
  }
  else {
    //window.alert('Please enter Username and Password!');
  }

  //close connection
  client.close();
}

async function register(username, password) {
  //start connection
  let url = "mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority";
  let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  //create and add user
  let user = { username: username, password: password };
  console.log(user);
  await client.db('SimplyShopDB').collection('UsersColl').insertOne(user);

  //close connection
  client.close();
}

//GET
app.get('/', (req, res) => {
  res.render('index', { title: 'HomePage' });
  res.end();
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
  res.end();
});

app.get('/home', (req, res) => {
  res.render('home', { title: 'home' });
  res.end();
});

app.get('/books', (req, res) => {
  res.render('books', { title: 'books' });
  res.end();
});

app.get('/boxing', (req, res) => {
  res.render('boxing', { title: 'boxing' });
  res.end();
});

app.get('/cart', (req, res) => {
  res.render('cart', { title: 'cart' });
  res.end();
});

app.get('/galaxy', (req, res) => {
  res.render('galaxy', { title: 'galaxy' });
  res.end();
});


app.get('/iphone', (req, res) => {
  res.render('iphone', { title: 'iphone' });
  res.end();
});

app.get('/leaves', (req, res) => {
  res.render('leaves', { title: 'leaves' });
  res.end();
});

app.get('/phones', (req, res) => {
  res.render('phones', { title: 'phones' });
  res.end();
});

app.get('/registration', (req, res) => {
  res.render('registration', { title: 'registration' });
  res.end();
});

app.get('/searchresults', (req, res) => {
  res.render('searchresults', { title: 'searchresults' });
  res.end();
});

app.get('/sports', (req, res) => {
  res.render('sports', { title: 'sports' });
  res.end();
});

app.get('/sun', (req, res) => {
  res.render('sun', { title: 'sun' });
  res.end();
});

app.get('/tennis', (req, res) => {
  res.render('tennis', { title: 'tennis' });
  res.end();
});

//POST
app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  login(username, password, req, res);
  window.alert('Incorrect Username and/or Password!');
  res.end();
});

app.post('/register', (req, res) => {
  register(req.body.username, req.body.password);
  res.redirect('/home');
  res.end();
});
