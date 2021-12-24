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
    client.db('SimplyShopDB').collection('ItemsColl').find({ 'item_name': { '$regex': '.*' + searchTerm + '.*', '$options': 'i' } }).toArray(function (err, items) {
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

async function addToCart(username, itemName, route, req, res) {

  //start connection
  let url = "mongodb+srv://admin:admin@simplyshop.pzba7.mongodb.net/SimplyShopDB?retryWrites=true&w=majority";
  let client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  let currCart;
  let itemFound = false;

  // find user cart
  client.db('SimplyShopDB').collection('UsersColl').findOne({ Username: username }, async function (err, result) {

    currCart = result.Cart;
    // if cart is not empty look for the item if it exists and increment its quantity
    if (!result.Cart.isEmpty) {
      currCart.forEach(item => {
        if (item.name == itemName) {
          item.quantity = item.quantity + 1;
          itemFound = true;
        }
      });
    }

    // if item doesn't exist then add it
    if (!itemFound) {
      currCart.push({ name: itemName, quantity: 1 });
    }
    await client.db('SimplyShopDB').collection('UsersColl').updateOne(
      { Username: username },
      { $set: { Cart: currCart } }
    )

    // close connection either way & display success message
    client.close();
    res.render(route, { addToCartMessage: 'item added to cart succesfully!' });
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
  res.render('cart');
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

app.post('/addToCart', (req, res) => {
  let itemName = req.body.itemName;
  let route = req.body.route;
  addToCart(username, itemName, route, req, res);
});
