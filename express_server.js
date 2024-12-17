// express server
const express = require("express");
const cookieSession = require("cookie-session");
const { getUserByEmail } = require("./helpers");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['secret-key']
}));

const users = {};


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Error: Email and Password fields cannot be empty.");
  }

  const user = getUserByEmail(email, users);
  if (!user) {
    return res.status(403).send("Error: Email cannot be found.");
  }

  if (user.password !== password) {
    return res.status(403).send("Error: Incorrect password.");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  req.session = null; 
  res.redirect("/login");
});


app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Error: Email and Password fields cannot be empty.");
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send("Error: Email already registered.");
  }

  const userId = `user${Math.random().toString(36).substring(2, 8)}`;
  users[userId] = { id: userId, email, password };

  req.session.user_id = userId;
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


