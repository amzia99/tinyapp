// express server code
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  b6UTxQ: "http://www.lighthouselabs.ca",
  i3BoGr: "http://www.google.com"
};


app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies.username,
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies.username
  };
  res.render('urls_new', templateVars);
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
