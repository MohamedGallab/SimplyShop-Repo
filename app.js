let express = require('express');
let path = require('path');
let app = express();
let { MongoClient } = require("mongodb");
const res = require('express/lib/response');

let username;
let password;

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
        res.render('login', { errorMessage: 'Wrong Password or Username, Please Try Again' });
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

async function register(username, password, req, res) {
  //start connection
  let url = "mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority";
  let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  // create and add user
  let user = { Username: username, Password: password, Cart: [] };

  // search for user name
  client.db('SimplyShopDB').collection('UsersColl').findOne({ Username: username }, async function (err, result) {

    // find if user already exists
    if (result) {
      res.render('registration', { errorMessage: 'UserName Already Exists' });
    }
    // register new user & cart
    else {
      await client.db('SimplyShopDB').collection('UsersColl').insertOne(user);
      res.redirect('/home');
    }
    // close connection either way
    client.close();
  }
  );
}

async function search(searchTerm, req, res) {

  //start connection
  let url = "mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority";
  let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  //Check search term is not null
  if (searchTerm) {
    let test = ".*" + searchTerm + ".*";
    console.log(test);
    //Query Items Collection to find the all matches
    client.db('SimplyShopDB').collection('ItemsColl').find({ 'item_name': {'$regex' : '.*'+ searchTerm +'.*', '$options' : 'i'}}).toArray(function (err, items) {
      console.log(items);
      res.render('searchresults', {
        items: items, // pass data from the server to the view
      });
      client.close();
    });
  }

  // if user didn't enter anything
  else {
    client.close();
    res.end();
  }
}


//GET
app.get('/', (req, res) => {
  res.redirect('/login');
  res.end();
});

app.get('/login', (req, res) => {
  res.render('login', { errorMessage: '' });
  res.end();
});

app.get('/registration', (req, res) => {
  res.render('registration', { errorMessage: '' });
  res.end();
});

app.get('/home', (req, res) => {
  res.render('home');
  res.end();
});

app.get('/books', (req, res) => {
  res.render('books');
  res.end();
});

app.get('/boxing', (req, res) => {
  res.render('boxing');
  res.end();
});

app.get('/cart', (req, res) => {
  res.render('cart');
  res.end();
});

app.get('/galaxy', (req, res) => {
  res.render('galaxy');
  res.end();
});


app.get('/iphone', (req, res) => {
  res.render('iphone');
  res.end();
});

app.get('/leaves', (req, res) => {
  res.render('leaves');
  res.end();
});

app.get('/phones', (req, res) => {
  res.render('phones');
  res.end();
});

app.get('/searchresults', (req, res) => {
  res.render('searchresults');
  res.end();
});

app.get('/sports', (req, res) => {
  res.render('sports');
  res.end();
});

app.get('/sun', (req, res) => {
  res.render('sun');
  res.end();
});

app.get('/tennis', (req, res) => {
  res.render('tennis');
  res.end();
});

//POST
app.post('/login', (req, res) => {
  username = req.body.username;
  password = req.body.password;
  login(username, password, req, res);
});

app.post('/register', (req, res) => {
  register(req.body.username, req.body.password, req, res);
});

app.post('/search', (req, res) => {
  let searchTerm = req.body.Search;
  search(searchTerm, req, res);
});