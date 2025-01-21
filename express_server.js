const express = require('express');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');
const { urlDatabase, users } = require('./data');
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

// Middleware to validate user session
const validateUserSession = (req, res, next) => {
  const userId = req.session.user_id;
  if (userId && users[userId]) {
    req.user = users[userId]; // Attach the user object to the request
    console.log(`User session validated: ${userId}, User:`, req.user);
    return next();
  }
  req.user = null; // No valid user
  console.log('No valid user session'); // this and following added for debugging
  next();
};

// Apply session validation middleware globally
app.use(validateUserSession);

// Routes
app.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/urls');
  }
  res.redirect('/login');
});

app.get('/urls', (req, res) => {
  if (!req.user) {
    console.log('Access denied: User not logged in'); 
    return res.status(403).send('<h1>Error: You must be logged in to view URLs!</h1>');
  }
  const userURLs = urlsForUser(req.user.id, urlDatabase);
  console.log('User URLs:', userURLs);
  const templateVars = { urls: userURLs, user: req.user };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  if (!req.user) {
    return res.redirect('/login'); // Restrict access if not logged in
  }
  const templateVars = { user: req.user };
  res.render('urls_new', templateVars);
});

app.get('/urls/:id', (req, res) => {
  const id = req.params.id; // Extract the short URL ID from the request parameters
  const url = urlDatabase[id]; // Retrieve the URL object from the database

  // Check if the URL exists
  if (!url) {
    console.log(`URL with ID ${id} not found`);
    return res.status(404).send('<h1>Error: URL not found!</h1>');
  }

  // Check if the logged-in user owns the URL
  if (!req.user || url.userID !== req.user.id) {
    console.log(`Access denied for URL ${id}: User is not the owner`);
    return res.status(403).send('<h1>Error: You do not have permission to access this URL!</h1>');
  }

  // Pass the URL details and user information to the template
  console.log('Rendering URL details:', { id, url, user: req.user });
  const user = req.user;
  const templateVars = { id, longURL: url.longURL, url, user };
  res.render('urls_show', templateVars);
});


// Highlighted Addition: Updated POST /urls route to ensure urlDatabase stores userID
app.post('/urls', (req, res) => {
  if (!req.user) {
    console.log('Attempt to create URL without logging in');
    return res.status(403).send('<h1>Error: You must be logged in to create URLs!</h1>');
  }
  const shortURL = generateRandomString();
  console.log(`Generated short URL: ${shortURL}, Long URL: ${req.body.longURL}`);
  
  // Updated structure to include userID
  urlDatabase[shortURL] = { 
    longURL: req.body.longURL, 
    userID: req.user.id 
  }; 
  console.log('Updated urlDatabase:', urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:id/delete', (req, res) => {
  const url = urlDatabase[req.params.id];

  if (!url || !req.user || url.userID !== req.user.id) {
    console.log(`Unauthorized delete attempt for URL ID: ${req.params.id}`);
    return res.status(403).send('<h1>Error: You do not have permission to delete this URL!</h1>');
  }
  console.log(`Deleting URL: ${req.params.id}`);
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  const url = urlDatabase[req.params.id];

  if (!url || !req.user || url.userID !== req.user.id) {
    return res.status(403).send('<h1>Error: You do not have permission to edit this URL!</h1>');
  }

  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect('/urls');
});

app.get('/u/:id', (req, res) => {
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];

  if (!url) {
    return res.status(404).send('<h1>Error: Short URL not found!</h1>');
  }

  res.redirect(url.longURL);
});

app.get('/register', (req, res) => {
  if (req.user) {
    return res.redirect('/urls'); // Redirect logged-in users to /urls
  }
  res.render('register', { user: null });
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res.status(400).send('<h1>Error: Email and password cannot be empty!</h1>');
  }

  // Check if email already exists
  if (getUserByEmail(email, users)) {
    return res.status(400).send('<h1>Error: Email is already registered!</h1>');
  }

  // Generate a new user ID and add the user to the database with a hashed password
  const userId = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10); // Hashing the password
  users[userId] = { id: userId, email, password: hashedPassword }; // Store hashed password
  req.session.user_id = userId;

  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/urls'); // Redirect if logged in
  }
  res.render('login', { user: null });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = getUserByEmail(email, users);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    console.log(`Failed login attempt: Email: ${email}`);
    return res.status(403).send('<h1>Error: Invalid email or password!</h1>');
  }

  console.log(`User logged in: ${user.id}, Email: ${user.email}`);
  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null; // Clear session
  res.redirect('/login');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
