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
  "i3BoGr": "http://www.google.com"
};

// mock users database
const users = { 
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
};

// random string generator
const generateRandomString = () => Math.random().toString(36).substring(2, 8);


// routes
app.get('/', (req, res) => {
  res.redirect('/urls'); // route root
});


app.get("/urls", (req, res) => {
  const userId = req.session.user_id; // Use user_id from session
  const user = users[userId]; // Retrieve user object
  const templateVars = { 
    urls: urlDatabase, 
    user // Pass user object instead of username
  };
  res.render("urls_index", templateVars);
});

app.get('/urls/new', (req, res) => {
  const userId = req.session.user_id; 
  const user = users[userId]; 
  if (!user) {
    return res.redirect('/login'); 
  }
  const templateVars = { user };
  res.render('urls_new', templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const userId = req.session.user_id; 
  const user = users[userId]; 
  const templateVars = { id, longURL, user }; 
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const userId = req.session.user_id; 
  const user = users[userId]; 
  const templateVars = { user }; 
  res.render("register", templateVars); 
});

app.post("/register", (req, res) => { 
  const { email, password } = req.body;

// Validate if email or password is missing
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty!");
  }

// Check if email already exists
if (getUserByEmail(email, users)) {
  return res.status(400).send("Error: Email is already registered!");
}

// Generate a random ID and create a new user
  const userId = generateRandomString();
  users[userId] = { id: userId, email, password };

// Set the session cookie and redirect
  req.session.user_id = userId; // Set user_id in session
  res.redirect("/urls");
});

app.post('/login', (req, res) => { 
  const { email, password } = req.body;

  // Find user by email
  let user;
  for (const userId in users) {
    if (users[userId].email === email) {
      user = users[userId];
    }
  }

  // Validate email and password
  if (!user || user.password !== password) {
    return res.status(403).send("Invalid email or password!");
  }

  // Set the session cookie and redirect
  req.session.user_id = user.id; //  Set user_id in session
  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  req.session = null; // Clear session on logout
  res.redirect('/urls');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});