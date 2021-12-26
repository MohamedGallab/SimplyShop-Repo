let express = require('express');
let path = require('path');
let session = require('express-session');
let MongoStore = require('connect-mongo');
let app = express();
let {MongoClient} = require("mongodb");

app.use(session({
  secret:'testu',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: 'mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority',
      ttl: 14 * 24 * 60 * 60,
      autoRemove: 'native'
  })
}));

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
    client.db('SimplyShopDB').collection('UsersColl').findOne({ Username: username, Password: password }, function (err, result) {
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

  if (username && password) {
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
  else {
    res.render('registration', { errorMessage: 'You have to enter a username and password' });
  }
}

async function createSession(req, res)
{
}

async function search(searchTerm, req, res) {

  //start connection
  let url = "mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority";
  let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  //Check search term is not null
  if (searchTerm) {
    let test = ".*" + searchTerm + ".*";
    //Query Items Collection to find the all matches
    client.db('SimplyShopDB').collection('ItemsColl').find({ 'Name': { '$regex': '.*' + searchTerm + '.*', '$options': 'i' } }).toArray(function (err, items) {
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

async function addToCart(itemName, route, req, res) {

  //start connection
  let url = "mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority";
  let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  let currCart;

  // find user cart
  client.db('SimplyShopDB').collection('UsersColl').findOne({ Username: username }, async function (err, result) {

    currCart = result.Cart;

    // if item already in cart displaye error
    if (currCart.includes(itemName)) {
      res.render(route, { addToCartMessage: 'item already in cart !' });
    }

    // else add it
    else {
      currCart.push(itemName);
      await client.db('SimplyShopDB').collection('UsersColl').updateOne(
        { Username: username },
        { $set: { Cart: currCart } }
      );
      res.render(route, { addToCartMessage: 'item added to cart succesfully !' });
    }

    // close connection either way
    client.close();
  }
  );
}

async function viewCart(username, req, res) {

  //start connection
  let url = "mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority";
  let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  let currCart;
  // find user cart
  client.db('SimplyShopDB').collection('UsersColl').findOne({ Username: username }, async function (err, result) {

    currCart = result.Cart;
    res.render('cart', { currCart: currCart });

    // close connection either way & display success message
    client.close();
  }
  );
}

//GET
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { errorMessage: '' });
});

app.get('/registration', (req, res) => {
  res.render('registration', { errorMessage: '' });
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/books', (req, res) => {
  res.render('books');
});

app.get('/boxing', (req, res) => {
  res.render('boxing', { addToCartMessage: '' });
});

app.get('/cart', (req, res) => {
  viewCart(username, req, res);
});

app.get('/galaxy', (req, res) => {
  res.render('galaxy', { addToCartMessage: '' });
});


app.get('/iphone', (req, res) => {
  res.render('iphone', { addToCartMessage: '' });
});

app.get('/leaves', (req, res) => {
  res.render('leaves', { addToCartMessage: '' });
});

app.get('/phones', (req, res) => {
  res.render('phones');
});

app.get('/searchresults', (req, res) => {
  res.render('searchresults');
});

app.get('/sports', (req, res) => {
  res.render('sports');
});

app.get('/sun', (req, res) => {
  res.render('sun', { addToCartMessage: '' });
});

app.get('/tennis', (req, res) => {
  res.render('tennis', { addToCartMessage: '' });
});

//POST
app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  req.session.username = username;
  login(username, password, req, res);
});

app.post('/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  register(username, password, req, res);
});

app.post('/search', (req, res) => {
  let searchTerm = req.body.Search;
  search(searchTerm, req, res);
});

app.post('/addToCart', (req, res) => {
  let itemName = req.body.itemName;
  let route = req.body.route;
  addToCart(username, itemName, route, req, res);
});
