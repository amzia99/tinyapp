// express server code
const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(express.urlencoded({ extended: true }));
const PORT = 8080; 

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.redirect(longURL); 
  } else {
    res.status(404).send("Short URL not found.");
  }
});


app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.render("urls_show", { shortURL, longURL });
  } else {
    res.status(404).send("URL not found.");
  }
});

if (!longURL) {
  res.status(404).send("Short URL not found.");
}

app.get("/login", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("register", templateVars);
});

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



app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL; 
  res.redirect(`/urls/${shortURL}`); 
});

app.post('/urls/:id/delete', (req, res) => {
  const shortURL = req.params.id; 
  delete urlDatabase[shortURL]; 
  res.redirect('/urls'); 
});

app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie("username", username); 
  res.redirect("/urls"); 
});

app.post('/login', (req, res) => {
  const username = req.body.username; 
  res.cookie('username', username); 
  res.redirect('/urls'); 
});


app.post("/logout", (req, res) => {
  res.clearCookie("username"); 
  res.redirect("/login");
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls'); 
});



function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
