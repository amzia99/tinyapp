// express server
const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ name: "session", keys: ["key1", "key2"] }));


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: bcrypt.hashSync("password", 10), 
  },
};


const urlsForUser = (id) => {
  const userURLs = {};
  for (const urlID in urlDatabase) {
    if (urlDatabase[urlID].userID === id) {
      userURLs[urlID] = urlDatabase[urlID];
    }
  }
  return userURLs;
};

const findUserByEmail = (email) => {
  for (const userID in users) {
    if (users[userID].email === email) {
      return users[userID];
    }
  }
  return null;
};

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) return res.status(403).send("Please log in first.");
  const templateVars = { urls: urlsForUser(userID), user: users[userID] };
  res.render("urls_index", templateVars);
});


app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password cannot be blank!");
  }

  if (findUserByEmail(email)) {
    return res.status(400).send("A user with this email already exists!");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userID = Math.random().toString(36).substring(2, 8);

  users[userID] = {
    id: userID,
    email,
    password: hashedPassword,
  };

  req.session.user_id = userID;
  res.redirect("/urls");
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(403).send("No user with that email found!");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Password is incorrect!");
  }

 req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const urlEntry = urlDatabase[req.params.id];
  if (!userID) return res.status(403).send("Please log in first.");
  if (!urlEntry) return res.status(404).send("URL not found.");
  if (urlEntry.userID !== userID) return res.status(403).send("You do not own this URL.");
  const templateVars = { id: req.params.id, longURL: urlEntry.longURL, user: users[userID] };
  res.render("urls_show", templateVars);
});


app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const urlEntry = urlDatabase[req.params.id];
  if (!userID) return res.status(403).send("Please log in first.");
  if (!urlEntry) return res.status(404).send("URL not found.");
  if (urlEntry.userID !== userID) return res.status(403).send("You do not own this URL.");
  urlEntry.longURL = req.body.longURL;
  res.redirect("/urls");
});


app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  const urlEntry = urlDatabase[req.params.id];
  if (!userID) return res.status(403).send("Please log in first.");
  if (!urlEntry) return res.status(404).send("URL not found.");
  if (urlEntry.userID !== userID) return res.status(403).send("You do not own this URL.");
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


app.listen(8080, () => {
  console.log("Server listening on port 8080!");
});
