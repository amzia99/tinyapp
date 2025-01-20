// express server code
const express = require('express');
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;

// EJS view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// middleware
app.use(
  cookieSession({
    name: 'session',
    keys: ['your-secret-key'], // replaced by securee keys
    maxAge: 24 * 60 * 60 * 1000, // for 24 hours
  })
);
app.use(express.urlencoded({ extended: true }));

// mock url database
const urlDatabase = {
  b6UTxQ: "http://www.lighthouselabs.ca",
  i3BoGr: "http://www.google.com"
};

app.get('/', (req, res) => {
  res.redirect('/urls'); // route root
});

// routes
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.session.username, // session used for username
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.session.username // session for username
  };
  res.render('urls_new', templateVars);
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  res.session.username = username; // set session for username
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.session = null; // clears session on logout
  res.redirect('/urls');
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
