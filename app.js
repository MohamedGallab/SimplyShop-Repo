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

  //Check userneame and password not null
  if (username && password) {

    //Query Users Collection to find the first match
    client.db('SimplyShopDB').collection('UsersColl').findOne({ username: username, password: password }, function (err, result) {
      // found a result so redirect which also ends the response
      if (result) {
        res.redirect('/home');
      }
      // or user didn't enter correct password so send an HTML
      else {
        res.send('<h1>Wrong Password or Username</h1> <br> <h2>Refresh Page and Try Again</h2>');
      }
      // close connection either way
      client.close();
    }
    );
  }
  // if user didn't enter anything
  else {
    res.end();
    client.close();
  }
}

async function register(username, password) {
  //start connection
  let url = "mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority";
  let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  //create and add user
  let user = { username: username, password: password };

  // insert unique users
  await client.db('SimplyShopDB').collection('UsersColl').updateOne(
    user,
    { $set: user },
    { upsert: true }
  );

  //close connection
  client.close();
}

//GET
app.get('/', (req, res) => {
  res.redirect('/login');
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
});

app.post('/register', (req, res) => {
  register(req.body.username, req.body.password);
  res.redirect('/home');
});
