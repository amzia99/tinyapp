// express server code
const express = require("express");
const app = express();

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
  const templateVars = { urls: urlDatabase };
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



function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
