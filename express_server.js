// express server code
const express = require('express');
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;

// EJS view engine
app.set('view engine', 'ejs');

// Middleware
app.use(
  cookieSession({
    name: 'session',
    keys: ['your-secret-key'], // Secure key
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(express.urlencoded({ extended: true }));

// Databases
const urlDatabase = {
  b6UTxQ: "http://www.lighthouselabs.ca",
  i3BoGr: "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
};

// Helper Functions
const generateRandomString = () => Math.random().toString(36).substring(2, 8);

const getUserByEmail = (email, users) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};

// Routes
app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.redirect('/login'); // Restrict access if not logged in
  }
  const user = users[userId];
  const templateVars = { user };
  res.render('urls_new', templateVars);
});

app.get('/urls/:id', (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const userId = req.session.user_id;

  if (!longURL) {
    return res.status(404).send("<h1>Error: URL not found!</h1>");
  }

  if (!userId) {
    return res.status(403).send("<h1>Error: You do not have permission to access this URL!</h1>");
  }

  const user = users[userId];
  const templateVars = { id, longURL, user };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.status(403).send("<h1>Error: You must be logged in to create URLs!</h1>");
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get('/u/:id', (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];

  if (!longURL) {
    return res.status(404).send("<h1>Error: Short URL not found!</h1>");
  }

  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    return res.redirect('/urls'); // Redirect if logged in
  }
  res.render('register', { user: null });
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Error: Email and password cannot be empty!");
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send("Error: Email is already registered!");
  }

  const userId = generateRandomString();
  users[userId] = { id: userId, email, password };

  req.session.user_id = userId;
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    return res.redirect('/urls'); // Redirect if logged in
  }
  res.render('login', { user: null });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = getUserByEmail(email, users);
  if (!user || user.password !== password) {
    return res.status(403).send("Error: Invalid email or password!");
  }

  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null; // Clear session
  res.redirect('/login'); // Redirect to login page
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
