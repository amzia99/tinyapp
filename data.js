// data code
// bcrypt so user passwords can be hashed
const bcrypt = require("bcryptjs");

// URL Database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

// Users Database
const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: bcrypt.hashSync("password", 10), // prehashed password for initial data
  },
};

// function to filter URLs for a specific user
const urlsForUser = (id) => {
  const userURLs = {};
  for (const urlID in urlDatabase) {
    if (urlDatabase[urlID].userID === id) {
      userURLs[urlID] = urlDatabase[urlID];
    }
  }
  return userURLs;
};

module.exports = {
  urlDatabase,
  users,
  urlsForUser,
};
