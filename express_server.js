// express server
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const users = {};

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

app.get('/register', (req, res) => {
  const templateVars = { user: null };
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password cannot be empty.');
  }

  for (let userId in users) {
    if (users[userId].email === email) {
      return res.status(400).send('Email already registered.');
    }
  }

  const userId = generateRandomString();
  users[userId] = { id: userId, email, password };

  res.cookie('user_id', userId);
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const userId = req.cookies['user_id'];
  const user = users[userId];

  const templateVars = { urls: {}, user };
  res.render('urls_index', templateVars);
});

app.get('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

